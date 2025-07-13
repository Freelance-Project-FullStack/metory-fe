from supabase import create_client, Client
from app.core.config import settings

# Khởi tạo client dùng service role key để có toàn quyền
supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_ROLE_KEY
)

# Khởi tạo client dùng anon key cho các tác vụ của user
supabase_anon: Client = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)

print("Supabase clients initialized.")