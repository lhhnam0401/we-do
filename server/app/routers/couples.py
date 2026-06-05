import random
import string

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.dependencies import get_current_user, get_db
from app.models.couple import Couple
from app.models.user import User
from app.schemas.couple import CoupleOut, JoinRequest

router = APIRouter(prefix="/couples", tags=["couples"])


def _generate_code() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=6))


async def _get_couple_with_members(db: AsyncSession, couple_id: str) -> Couple | None:
    result = await db.execute(
        select(Couple).options(selectinload(Couple.members)).where(Couple.id == couple_id)
    )
    return result.scalar_one_or_none()


@router.post("/create", response_model=CoupleOut, status_code=201)
async def create_couple(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.couple_id:
        raise HTTPException(status_code=400, detail="Already in a couple")

    # generate unique code
    for _ in range(10):
        code = _generate_code()
        existing = await db.execute(select(Couple).where(Couple.invite_code == code))
        if not existing.scalar_one_or_none():
            break

    couple = Couple(invite_code=code, created_by=user.id)
    db.add(couple)
    await db.flush()

    user.couple_id = couple.id
    await db.commit()
    await db.refresh(couple)

    return await _get_couple_with_members(db, couple.id)


@router.post("/join", response_model=CoupleOut)
async def join_couple(body: JoinRequest, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if user.couple_id:
        raise HTTPException(status_code=400, detail="Already in a couple")

    result = await db.execute(select(Couple).where(Couple.invite_code == body.invite_code.upper()))
    couple = result.scalar_one_or_none()
    if not couple:
        raise HTTPException(status_code=404, detail="Invite code not found")

    # Check couple doesn't already have 2 members
    members_result = await db.execute(select(User).where(User.couple_id == couple.id))
    members = members_result.scalars().all()
    if len(members) >= 2:
        raise HTTPException(status_code=400, detail="Couple is already full")

    user.couple_id = couple.id
    await db.commit()

    return await _get_couple_with_members(db, couple.id)


@router.get("/me", response_model=CoupleOut)
async def get_my_couple(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.couple_id:
        raise HTTPException(status_code=404, detail="Not in a couple")
    couple = await _get_couple_with_members(db, user.couple_id)
    if not couple:
        raise HTTPException(status_code=404, detail="Couple not found")
    return couple


@router.delete("/leave")
async def leave_couple(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if not user.couple_id:
        raise HTTPException(status_code=400, detail="Not in a couple")
    user.couple_id = None
    await db.commit()
    return {"detail": "Left couple"}
