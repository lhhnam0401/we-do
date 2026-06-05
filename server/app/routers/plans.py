from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_user, get_db
from app.models.plan import Plan
from app.models.user import User
from app.schemas.plan import PlanCreate, PlanOut, PlanStatusUpdate, PlanUpdate
from app.ws_manager import manager

router = APIRouter(prefix="/plans", tags=["plans"])


def _assert_couple(user: User):
    if not user.couple_id:
        raise HTTPException(status_code=403, detail="Join a couple first")


def _assert_plan_access(plan: Plan, user: User):
    if plan.couple_id != user.couple_id:
        raise HTTPException(status_code=403, detail="Access denied")


@router.get("", response_model=list[PlanOut])
async def list_plans(
    status: str | None = Query(None),
    category: str | None = Query(None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _assert_couple(user)
    q = select(Plan).where(Plan.couple_id == user.couple_id, Plan.is_archived == False)
    if status:
        q = q.where(Plan.status == status)
    if category:
        q = q.where(Plan.category == category)
    q = q.order_by(Plan.created_at.desc())
    result = await db.execute(q)
    return result.scalars().all()


@router.post("", response_model=PlanOut, status_code=201)
async def create_plan(body: PlanCreate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    _assert_couple(user)
    plan = Plan(couple_id=user.couple_id, created_by=user.id, **body.model_dump())
    db.add(plan)
    await db.commit()
    await db.refresh(plan)
    await manager.broadcast(user.couple_id, {"type": "plan_updated", "plan_id": plan.id, "action": "created"})
    return plan


@router.get("/{plan_id}", response_model=PlanOut)
async def get_plan(plan_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    _assert_couple(user)
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan or plan.is_archived:
        raise HTTPException(status_code=404, detail="Plan not found")
    _assert_plan_access(plan, user)
    return plan


@router.patch("/{plan_id}", response_model=PlanOut)
async def update_plan(
    plan_id: str, body: PlanUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    _assert_couple(user)
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan or plan.is_archived:
        raise HTTPException(status_code=404, detail="Plan not found")
    _assert_plan_access(plan, user)

    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(plan, field, value)
    await db.commit()
    await db.refresh(plan)
    await manager.broadcast(user.couple_id, {"type": "plan_updated", "plan_id": plan.id, "action": "updated"})
    return plan


@router.patch("/{plan_id}/status", response_model=PlanOut)
async def update_plan_status(
    plan_id: str, body: PlanStatusUpdate, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    _assert_couple(user)
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan or plan.is_archived:
        raise HTTPException(status_code=404, detail="Plan not found")
    _assert_plan_access(plan, user)

    plan.status = body.status
    plan.completed_at = datetime.now(timezone.utc) if body.status == "done" else None
    await db.commit()
    await db.refresh(plan)
    await manager.broadcast(user.couple_id, {"type": "plan_updated", "plan_id": plan.id, "action": "updated"})
    return plan


@router.delete("/{plan_id}")
async def delete_plan(plan_id: str, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    _assert_couple(user)
    result = await db.execute(select(Plan).where(Plan.id == plan_id))
    plan = result.scalar_one_or_none()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
    _assert_plan_access(plan, user)

    plan.is_archived = True
    await db.commit()
    await manager.broadcast(user.couple_id, {"type": "plan_updated", "plan_id": plan.id, "action": "deleted"})
    return {"detail": "Plan archived"}
