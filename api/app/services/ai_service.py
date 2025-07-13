import google.generativeai as genai
from app.core.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
generation_config = {
  "temperature": 0.7,
  "top_p": 1,
  "top_k": 1,
  "max_output_tokens": 2048,
}
safety_settings = [
    # Cấu hình an toàn, tùy chỉnh theo nhu cầu
]
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings
)

async def ask_gemini(context: str, user_question: str):
    """Gửi câu hỏi tới Gemini và nhận câu trả lời."""
    try:
        prompt = f"""Dựa trên ngữ cảnh sau đây về một câu chuyện cá nhân: '{context}',
        hãy trả lời câu hỏi của người dùng một cách tự nhiên và thân thiện.
        Câu hỏi: '{user_question}'"""
        
        response = await model.generate_content_async(prompt)
        return response.text
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return "Xin lỗi, tôi đang gặp sự cố nhỏ. Bạn có thể hỏi lại sau không?"

async def find_closest_question_vector(story_id: int, user_question_text: str):
    """
    Sử dụng pg_vector để tìm câu hỏi gần nhất.
    Đây là một hàm giả định, bạn cần cài đặt pg_vector trên Supabase
    và tạo embedding cho câu hỏi khi chúng được tạo ra.
    """
    # 1. Tạo embedding cho câu hỏi của người dùng (dùng 1 model embedding)
    # 2. Gọi một RPC function trên Supabase để thực hiện tìm kiếm vector
    # response = supabase.rpc('match_questions', {'story_id': story_id, 'query_embedding': embedding}).execute()
    # return response.data
    # Do phức tạp, tạm thời bỏ qua và dùng Gemini trực tiếp trong bản này.
    pass