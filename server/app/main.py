from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import create_tables
from app.routers import auth, couples, photos, plans, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure upload dir exists
    Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
    Path("data").mkdir(exist_ok=True)
    await create_tables()
    yield


app = FastAPI(title="We Do API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(couples.router)
app.include_router(plans.router)
app.include_router(photos.router)
app.include_router(websocket.router)

# Serve uploaded files
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")


@app.get("/health")
async def health():
    return {"status": "ok"}
