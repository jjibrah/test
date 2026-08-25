from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import Base, SessionLocal, engine
from .routers import orders


def seed_orders():
    db = SessionLocal()
    try:
        if db.query(models.Order).count() == 0:
            db.add_all(
                [
                    models.Order(
                        customer_name="Aisha Rahman",
                        customer_email="aisha@example.com",
                        product_name="Ergonomic Keyboard",
                        quantity=2,
                        unit_price=89.50,
                        status=models.OrderStatus.pending,
                    ),
                    models.Order(
                        customer_name="Daniel Wong",
                        customer_email="daniel@example.com",
                        product_name="USB-C Dock",
                        quantity=1,
                        unit_price=149.99,
                        status=models.OrderStatus.processing,
                    ),
                    models.Order(
                        customer_name="Mei Lin",
                        customer_email="mei@example.com",
                        product_name="Laptop Stand",
                        quantity=3,
                        unit_price=45.00,
                        status=models.OrderStatus.completed,
                    ),
                ]
            )
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_orders()
    yield


app = FastAPI(title="Internal Orders API", version="0.8.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(orders.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "orders-api"}
