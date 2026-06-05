import os
import uuid
from pathlib import Path

import aiofiles
from PIL import Image

from app.config import settings

UPLOAD_ROOT = Path(settings.upload_dir)


def _plan_dir(plan_id: str) -> Path:
    d = UPLOAD_ROOT / plan_id
    d.mkdir(parents=True, exist_ok=True)
    return d


async def save_image(plan_id: str, data: bytes, original_filename: str) -> tuple[str, str]:
    """Save original (max 1200px) and thumbnail (max 400px). Returns (file_path, thumbnail_path)."""
    uid = str(uuid.uuid4())
    ext = Path(original_filename).suffix.lower() or ".jpg"
    plan_dir = _plan_dir(plan_id)

    original_path = plan_dir / f"original_{uid}{ext}"
    thumb_path = plan_dir / f"thumb_{uid}{ext}"

    # Write raw bytes first
    async with aiofiles.open(original_path, "wb") as f:
        await f.write(data)

    # Resize with Pillow (sync — small images, acceptable)
    with Image.open(original_path) as img:
        img = img.convert("RGB")
        orig = img.copy()
        orig.thumbnail((1200, 1200), Image.LANCZOS)
        orig.save(original_path, quality=85)

        thumb = img.copy()
        thumb.thumbnail((400, 400), Image.LANCZOS)
        thumb.save(thumb_path, quality=80)

    return str(original_path), str(thumb_path)


def delete_image_files(file_path: str, thumbnail_path: str) -> None:
    for p in (file_path, thumbnail_path):
        try:
            os.remove(p)
        except FileNotFoundError:
            pass
