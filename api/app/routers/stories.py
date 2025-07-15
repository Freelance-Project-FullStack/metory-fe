import json
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from app.dependencies.auth import get_current_user
from app.schemas.story import StoryCreate, PresignedUrlRequest, VideoUploadSuccess
from app.services.supabase_client import supabase
from app.services import r2_client
from app.core.config import settings

router = APIRouter(prefix="/stories", tags=["Stories"])

@router.post("/", status_code=201, summary="Create a new story with video uploads")
async def create_story_with_videos(
    current_user: dict = Depends(get_current_user),
    title: str = Form(..., description="The title of the story."),
    segments: str = Form(..., description="A JSON string array of segment metadata. E.g., '[{\"question_id\": 1, \"duration\": 15}]'"),
    videos: List[UploadFile] = File(..., description="List of video files, in the same order as segments.")
):
    """
    Create a new story by uploading all metadata and video files in a single request.
    
    The server will handle uploading videos to R2 and linking them to the story.
    """
    user_id = current_user['id']
    
    # --- 1. Validate Input ---
    try:
        segments_data = json.loads(segments)
        if not isinstance(segments_data, list):
            raise ValueError()
    except (json.JSONDecodeError, ValueError):
        raise HTTPException(status_code=400, detail="Invalid JSON format for 'segments'. It must be an array of objects.")

    if len(segments_data) != len(videos):
        raise HTTPException(status_code=400, detail=f"Mismatch between number of segments ({len(segments_data)}) and videos ({len(videos)}).")

    # --- 2. Process Story Creation (with rollback mechanism) ---
    created_story_id = None
    uploaded_video_keys = []

    try:
        # BƯỚC 2.1: Tạo record story chính trong database
        story_res = supabase.table('stories').insert({
            'title': title,
            'user_id': user_id,
            'thumbnail_url': None # Sẽ được cập nhật sau nếu cần
        }).execute()

        if not story_res.data:
            raise Exception("Failed to create story record in database.")
        created_story_id = story_res.data[0]['id']

        # BƯỚC 2.2: Lặp qua từng video, upload lên R2 và chuẩn bị dữ liệu cho database
        questions_to_insert = []
        for i, video_file in enumerate(videos):
            segment_info = segments_data[i]
            
            # Tạo một tên file duy nhất trên R2
            file_key = f"stories/{created_story_id}/{uuid.uuid4()}-{video_file.filename}"
            
            # Đọc nội dung file và upload
            contents = await video_file.read()
            r2_client.s3_client.put_object(
                Bucket=settings.R2_BUCKET_NAME,
                Key=file_key,
                Body=contents,
                ContentType=video_file.content_type
            )
            uploaded_video_keys.append(file_key)
            
            # Lấy URL công khai của file vừa upload
            video_url = f"{settings.R2_PUBLIC_URL}/{file_key}"

            # Chuẩn bị dữ liệu để insert vào bảng 'questions'
            questions_to_insert.append({
                'story_id': created_story_id,
                'question_text': segment_info.get('question_text', f"Question {i+1}"), # Lấy text từ client hoặc tạo mặc định
                'duration': segment_info.get('duration', 0),
                'video_url': video_url,
                'order': i # Lưu lại thứ tự của video
            })

        # BƯỚC 2.3: Insert tất cả các record question vào database
        if questions_to_insert:
            questions_res = supabase.table('questions').insert(questions_to_insert).execute()
            if not questions_res.data:
                raise Exception("Failed to insert questions/segments into database.")

        # Nếu mọi thứ thành công, trả về kết quả
        return {
            "message": "Story created successfully!",
            "story_id": created_story_id,
            "video_urls": [q['video_url'] for q in questions_to_insert]
        }

    except Exception as e:
        # --- 3. ROLLBACK: Dọn dẹp nếu có lỗi xảy ra ---
        print(f"An error occurred: {e}. Starting rollback...")

        # Xóa các file đã upload lên R2
        if uploaded_video_keys:
            objects_to_delete = [{'Key': key} for key in uploaded_video_keys]
            r2_client.s3_client.delete_objects(
                Bucket=settings.R2_BUCKET_NAME,
                Delete={'Objects': objects_to_delete}
            )
            print(f"Rolled back {len(uploaded_video_keys)} files from R2.")

        # Xóa story và các questions liên quan khỏi database
        if created_story_id:
            # Supabase đã cấu hình cascade delete, nên chỉ cần xóa story
            supabase.table('stories').delete().eq('id', created_story_id).execute()
            print(f"Rolled back story with ID {created_story_id} from database.")
        
        # Trả về lỗi cho client
        raise HTTPException(status_code=500, detail=f"Could not create story. An internal error occurred: {str(e)}")


@router.get("/")
async def get_user_stories(current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    res = supabase.table('stories').select('*').eq('user_id', user_id).execute()
    return res.data

@router.post("/{story_id}/upload-url")
async def create_upload_url(story_id: int, request_data: PresignedUrlRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    # Kiểm tra story thuộc về user
    story = supabase.table('stories').select('id').eq('id', story_id).eq('user_id', user_id).single().execute()
    if not story.data:
        raise HTTPException(status_code=404, detail="Story not found or access denied")

    unique_file_name = f"{user_id}/{story_id}/{request_data.question_id}/{request_data.file_name}"
    
    upload_info = r2_client.create_presigned_upload_url(
        bucket_name=settings.R2_BUCKET_NAME,
        object_name=unique_file_name
    )
    if not upload_info:
        raise HTTPException(status_code=500, detail="Could not create upload URL")

    # Tạo video_url để lưu sau khi upload thành công
    video_url = f"https://YOUR_R2_PUBLIC_DOMAIN/{unique_file_name}" # Thay YOUR_R2_PUBLIC_DOMAIN
    
    # Cập nhật bảng questions với đường dẫn video tương lai
    supabase.table('questions').update({'video_url': video_url}).eq('id', request_data.question_id).execute()

    return upload_info