from fastapi import APIRouter, Depends, HTTPException
from typing import List
from uuid import UUID
from app.dependencies.auth import get_current_user
from app.schemas.story import StoryCreate, PresignedUrlRequest, VideoUploadSuccess
from app.services.supabase_client import supabase
from app.services import r2_client
from app.core.config import settings

router = APIRouter(prefix="/stories", tags=["Stories"])

@router.post("/")
async def create_story(story_data: StoryCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user['id']
    
    # 1. Tạo Story mới trong bảng 'stories'
    story_res = supabase.table('stories').insert({
        'title': story_data.title,
        'user_id': user_id
    }).execute()

    if not story_res.data:
        raise HTTPException(status_code=500, detail="Could not create story")
    
    story_id = story_res.data[0]['id']

    # 2. Thêm các câu hỏi vào bảng 'questions'
    questions_to_insert = [
        {'story_id': story_id, 'question_text': q.question_text}
        for q in story_data.questions
    ]
    questions_res = supabase.table('questions').insert(questions_to_insert).execute()
    
    if not questions_res.data:
        # Rollback bằng cách xóa story đã tạo
        supabase.table('stories').delete().eq('id', story_id).execute()
        raise HTTPException(status_code=500, detail="Could not create questions")

    return {"message": "Story created successfully", "story_id": story_id}

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