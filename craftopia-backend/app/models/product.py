from typing import List, Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from sqlalchemy import Column, JSON
import uuid

class Product(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str
    description: str
    price: float
    category: str
    stock: int
    images: List[str] = Field(default=[], sa_column=Column(JSON))
    tags: List[str] = Field(default=[], sa_column=Column(JSON))
    materials: Optional[str] = None
    dimensions: Optional[str] = None
    weight: Optional[float] = None
    careInstructions: Optional[str] = None
    artistStory: Optional[str] = None
    limitedEdition: bool = False
    launchDate: Optional[datetime] = None
    createdAt: datetime = Field(default_factory=datetime.now)
