from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas


def list_orders(db: Session, skip: int = 0, limit: int = 100):
    statement = select(models.Order).order_by(models.Order.created_at.desc()).limit(limit + 1)
    orders = list(db.scalars(statement).all())
    total = len(orders)
    return orders, total


def get_order(db: Session, order_id: int):
    return db.get(models.Order, order_id)


def create_order(db: Session, order: schemas.OrderCreate):
    values = order.model_dump()
    values["unit_price"] = int(values["unit_price"])
    db_order = models.Order(**values)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def update_order(db: Session, db_order: models.Order, order: schemas.OrderUpdate):
    for field, value in order.model_dump().items():
        setattr(db_order, field, value)
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


async def delete_order(db: Session, db_order: models.Order):
    db.delete(db_order)
    db.commit()
