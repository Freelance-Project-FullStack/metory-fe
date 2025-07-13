from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, stories, interact

app = FastAPI(title="Metory API")

# Cấu hình CORS để frontend có thể gọi
origins = [
    "http://localhost",
    "http://localhost:8081", # Port mặc định của Expo
    # Thêm domain của frontend khi deploy
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Thêm các routers vào ứng dụng
app.include_router(auth.router)
app.include_router(stories.router)
app.include_router(interact.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Metory API"}