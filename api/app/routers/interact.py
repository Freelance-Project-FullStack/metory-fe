from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services import ai_service
from app.services.supabase_client import supabase

router = APIRouter(prefix="/interact", tags=["Interaction"])

class InteractRequest(BaseModel):
    user_question: str

@router.post("/{story_id}")
async def interact_with_story(story_id: int, request: InteractRequest):
    # Lấy tất cả câu hỏi và câu trả lời đã có của story để làm ngữ cảnh
    res = supabase.table('questions').select('question_text, video_url').eq('story_id', story_id).execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Story not found or has no content")
    
    # Tạo ngữ cảnh từ các câu hỏi đã có
    context = ". ".join([q['question_text'] for q in res.data if q.get('question_text')])
    
    # Ở đây, để đơn giản, chúng ta sẽ gọi Gemini để nó tự chọn câu trả lời
    # Trong thực tế, bạn sẽ dùng semantic search để tìm video_url trước, nếu không thấy mới gọi Gemini
    
    # Tìm video gần nhất (giả định)
    # closest_video = await ai_service.find_closest_question_vector(...)
    # if closest_video:
    #     return {"video_url": closest_video['video_url']}

    # Nếu không, hãy để Gemini quyết định
    ai_response_text = await ai_service.ask_gemini(context, request.user_question)

    # Logic đơn giản: tìm từ khóa trong câu trả lời của AI để khớp với câu hỏi gốc
    # Đây là điểm cần cải thiện, nhưng là một khởi đầu
    best_match_url = None
    for q in res.data:
        # Nếu một phần của câu hỏi gốc xuất hiện trong câu trả lời của AI
        if q['question_text'].lower() in ai_response_text.lower():
            best_match_url = q['video_url']
            break
    
    if not best_match_url:
        # Trả về video đầu tiên nếu không tìm thấy khớp nào
        best_match_url = res.data[0]['video_url']

    return {"video_url": best_match_url, "ai_suggestion": ai_response_text}