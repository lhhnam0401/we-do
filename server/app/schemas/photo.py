from datetime import datetime

from pydantic import BaseModel


class PhotoOut(BaseModel):
    id: str
    plan_id: str
    uploaded_by: str
    file_path: str
    thumbnail_path: str
    original_filename: str
    created_at: datetime

    model_config = {"from_attributes": True}
