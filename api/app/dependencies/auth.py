from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.core.config import settings
from app.services.supabase_client import supabase

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # FastAPI's OAuth2PasswordBearer sẽ lấy token từ header.
        # Nhưng Supabase trả về một JWT khác. Chúng ta cần xác thực nó.
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            raise credentials_exception
        
        return user.dict() # Trả về thông tin user dưới dạng dict
    except Exception:
        raise credentials_exception