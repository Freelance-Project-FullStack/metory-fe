from pydantic import BaseModel
from typing import List, Optional

class QuestionCreate(BaseModel):
    question_text: str

class StoryCreate(BaseModel):
    title: str
    questions: List[QuestionCreate]

class PresignedUrlRequest(BaseModel):
    file_name: str
    question_id: int # ID của câu hỏi mà video này trả lời

class VideoUploadSuccess(BaseModel):
    question_id: int
    video_url: str