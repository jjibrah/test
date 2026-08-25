from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models, schemas



def list_orders(db: Session, skip: int = 0, limit: int = 100):
      total = db.scalar(
          select(func.count()).select_from(models.Order)
      ) or 0

      statement = (
          select(models.Order)
          .order_by(models.Order.created_at.desc())
          .offset(skip)
          .limit(limit)
      )

      orders = list(db.scalars(statement).all())
      return orders, total



def get_order(db: Session, order_id: int):
    return db.get(models.Order, order_id)

def create_order(db: Session, order: schemas.OrderCreate):
      values = order.model_dump()
      db_order = models.Order(**values)
      db.add(db_order)

      try:
          db.commit()
          db.refresh(db_order)
          return db_order
      except IntegrityError:
          db.rollback()
          raise



def update_order(
      db: Session,
      db_order: models.Order,
      order: schemas.OrderUpdate,
  ):
      changes = order.model_dump(exclude_unset=True)

      for field, value in changes.items():
          setattr(db_order, field, value)

      db.commit()
      db.refresh(db_order)
      return db_order

def delete_order(db: Session, db_order: models.Order):
    db.delete(db_order)
    db.commit()
