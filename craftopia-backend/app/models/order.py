from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from sqlalchemy import Column, JSON
import uuid
from .user import Address 

class OrderItem(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    order_id: Optional[str] = Field(default=None, foreign_key="order.id")
    productId: str # Changed to str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None
    
    order: Optional["Order"] = Relationship(back_populates="items")

class Order(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    userId: str = Field(foreign_key="user.id")
    items: List[OrderItem] = Relationship(back_populates="order")
    shippingAddress: dict = Field(default={}, sa_column=Column(JSON))
    subtotal: float
    discount: float
    tax: float
    total: float
    status: str = "Pending"
    paymentStatus: str = "Pending"
    createdAt: datetime = Field(default_factory=datetime.now)

class OrderItemCreate(SQLModel):
    productId: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class OrderCreate(SQLModel):
    items: List[OrderItemCreate]
    shippingAddress: dict
    subtotal: float
    discount: float
    tax: float
    total: float
    paymentStatus: str = "Pending"

class OrderItemResponse(SQLModel):
    id: str
    productId: str
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class OrderResponse(SQLModel):
    id: str
    userId: str
    items: List[OrderItemResponse] = []
    shippingAddress: dict
    subtotal: float
    discount: float
    tax: float
    total: float
    status: str
    paymentStatus: str
    createdAt: datetime

