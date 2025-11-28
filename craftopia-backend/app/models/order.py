from typing import List, Optional
from beanie import Document, PydanticObjectId
from pydantic import BaseModel
from datetime import datetime
from .user import Address

class OrderItem(BaseModel):
    productId: PydanticObjectId
    name: str
    price: float
    quantity: int
    image: Optional[str] = None

class Order(Document):
    userId: PydanticObjectId
    items: List[OrderItem]
    shippingAddress: Address
    subtotal: float
    discount: float
    tax: float
    total: float
    status: str = "Pending"
    paymentStatus: str = "Pending"
    createdAt: datetime = datetime.now()

    class Settings:
        name = "orders"
