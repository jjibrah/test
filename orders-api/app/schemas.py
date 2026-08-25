from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from .models import OrderStatus


class OrderBase(BaseModel):
    customer_name: str = Field(min_length=1, max_length=120)
    customer_email: EmailStr
    product_name: str = Field(min_length=1, max_length=160)
    quantity: int = Field(ge=1, le=1000)
    unit_price: Decimal = Field(gt=0, decimal_places=2)


class OrderCreate(OrderBase):
    status: OrderStatus = OrderStatus.pending


class OrderUpdate(BaseModel):
    customer_name: str | None = None
    customer_email: EmailStr | None = None
    product_name: str | None = None
    quantity: int | None = Field(default=None, ge=1, le=1000)
    unit_price: Decimal | None = Field(default=None, gt=0, decimal_places=2)
    status: OrderStatus | None = None


class OrderResponse(OrderBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: OrderStatus
    created_at: datetime


class OrderListResponse(BaseModel):
    orders: list[OrderResponse]
    total: int


class OrderSummaryResponse(BaseModel):
    total_orders: int
    pending_orders: int
    completed_orders: int
    total_value: Decimal
    latest_created_at: datetime | None
