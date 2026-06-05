from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel


class PlanCreate(BaseModel):
    title: str
    description: str | None = None
    category: Literal["travel", "food", "home", "adventure", "other"] = "other"
    target_date: date | None = None


class PlanUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    category: Literal["travel", "food", "home", "adventure", "other"] | None = None
    target_date: date | None = None


class PlanStatusUpdate(BaseModel):
    status: Literal["pending", "done"]


class PlanOut(BaseModel):
    id: str
    couple_id: str
    created_by: str
    title: str
    description: str | None
    category: str
    target_date: date | None
    status: str
    completed_at: datetime | None
    is_archived: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
