import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    display_name: Mapped[str] = mapped_column(String, nullable=False)
    couple_id: Mapped[str | None] = mapped_column(String, ForeignKey("couples.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    couple: Mapped["Couple | None"] = relationship("Couple", back_populates="members", foreign_keys=[couple_id])
    plans: Mapped[list["Plan"]] = relationship("Plan", back_populates="creator", foreign_keys="Plan.created_by")
    photos: Mapped[list["Photo"]] = relationship("Photo", back_populates="uploader")
