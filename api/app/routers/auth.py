from fastapi import APIRouter, HTTPException, status
from app.services.supabase_client import supabase_anon as supabase
from app.schemas.user import UserCreate, UserLogin, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register_user(user_credentials: UserCreate):
    try:
        res = supabase.auth.sign_up({
            "email": user_credentials.email,
            "password": user_credentials.password,
        })
        # Kiểm tra lỗi trả về từ Supabase
        if res.user is None:
             raise HTTPException(status_code=400, detail="User already exists or invalid data")

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    
    return {"message": "User created successfully. Please check your email for verification."}

@router.post("/login", response_model=Token)
async def login_user(user_credentials: UserLogin):
    try:
        res = supabase.auth.sign_in_with_password({
            "email": user_credentials.email,
            "password": user_credentials.password
        })
        if not res.session or not res.session.access_token:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return {"access_token": res.session.access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")