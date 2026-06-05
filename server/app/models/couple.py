import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Couple(Base):
    __tablename__ = "couples"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    invite_code: Mapped[str] = mapped_column(String(6), unique=True, nullable=False, index=True)
    created_by: Mapped[str] = mapped_column(String, ForeignKey("users.id"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    members: Mapped[list["User"]] = relationship("User", back_populates="couple", foreign_keys="User.couple_id")
    plans: Mapped[list["Plan"]] = relationship("Plan", back_populates="couple")
