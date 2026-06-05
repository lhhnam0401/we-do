from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.dependencies import get_current_user, get_db
from app.models.photo import Photo
from app.models.plan import Plan
from app.models.user import User
from app.schemas.photo import PhotoOut
from app.services.image_service import delete_image_files, save_image
from app.ws_manager import manager

router = APIRouter(prefix="/plans/{plan_id}/photos", tags=["photos"])

MAX_BYTES = settings.max_upload_size_mb * 1024 * 1024


def _assert_access(plan: Plan, user: User):
    if plan.couple_id != user.couple_id:
        raise HTTPException(status_code=403, detail="Access denied")


async def _get_plan(plan_id: str, user: User, db: AsyncSession) -> Plan:
    if not user.couple_id:
        raise HTTPException(status_code=403, detail="Join a couple first")
    result = await db.execute(select(Plan).where(Plan.id == plan_id, Plan.is_archived == False))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    _assert_access(plan, user)
    return plan


@router.post("", response_model=PhotoOut, status_code=201)
async def upload_photo(
    plan_id: str,
    file: UploadFile,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    plan = await _get_plan(plan_id, user, db)

    data = await file.read()
    if len(data) > MAX_BYTES:
        raise HTTPException(status_code=413, detail=f"File exceeds {settings.max_upload_size_mb}MB limit")

    file_path, thumb_path = await save_image(plan_id, data, file.filename or "upload.jpg")

    photo = Photo(
        plan_id=plan.id,
        uploaded_by=user.id,
        file_path=file_path,
        thumbnail_path=thumb_path,
        original_filename=file.filename or "upload.jpg",
    )
    db.add(photo)
    await db.commit()
    await db.refresh(photo)
    await manager.broadcast(user.couple_id, {"type": "plan_updated", "plan_id": plan.id, "action": "photo_added"})
    return photo


@router.get("", response_model=list[PhotoOut])
async def list_photos(
    plan_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_plan(plan_id, user, db)
    result = await db.execute(select(Photo).where(Photo.plan_id == plan_id).order_by(Photo.created_at))
    return result.scalars().all()


@router.delete("/{photo_id}")
async def delete_photo(
    plan_id: str,
    photo_id: str,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    plan = await _get_plan(plan_id, user, db)
    result = await db.execute(select(Photo).where(Photo.id == photo_id, Photo.plan_id == plan_id))
    photo = result.scalar_one_or_none()
    if not photo:
        raise HTTPException(status_code=404, detail="Photo not found")

    delete_image_files(photo.file_path, photo.thumbnail_path)
    await db.delete(photo)
    await db.commit()
    await manager.broadcast(user.couple_id, {"type": "plan_updated", "plan_id": plan.id, "action": "updated"})
    return {"detail": "Photo deleted"}
