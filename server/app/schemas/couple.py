from datetime import datetime

from pydantic import BaseModel

from app.schemas.auth import UserOut


class CoupleOut(BaseModel):
    id: str
    invite_code: str
    created_by: str
    created_at: datetime
    members: list[UserOut]

    model_config = {"from_attributes": True}


class JoinRequest(BaseModel):
    invite_code: str
