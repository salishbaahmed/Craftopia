from typing import List, Optional
from beanie import Document
from datetime import datetime

class Product(Document):
    name: str
    description: str
    price: float
    category: str
    stock: int
    images: List[str] = []
    tags: List[str] = []
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[float] = None
    careInstructions: Optional[str] = None
    artistStory: Optional[str] = None
    limitedEdition: bool = False
    launchDate: Optional[datetime] = None
    createdAt: datetime = datetime.now()

    class Settings:
        name = "products"
