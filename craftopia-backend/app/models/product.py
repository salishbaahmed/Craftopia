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


# Base decorator class
class ProductDecorator:
    def __init__(self, product: Product):
        self._product = product

    def get_price(self) -> float:
        return self._product.price

    def get_details(self) -> str:
        return self._product.description

    def __str__(self) -> str:
        return f"{self._product.name} - {self._product.category}"

# Concrete decorator for applying a discount
class DiscountDecorator(ProductDecorator):
    def __init__(self, product: Product, discount_percentage: float):
        super().__init__(product)
        self.discount_percentage = discount_percentage

    def get_price(self) -> float:
        original_price = super().get_price()
        discounted_price = original_price * (1 - self.discount_percentage / 100)
        return discounted_price

    def __str__(self) -> str:
        return f"{super().__str__()} - Discounted Price: ${self.get_price():.2f}"

# Concrete decorator for applying a special label
class SpecialLabelDecorator(ProductDecorator):
    def __init__(self, product: Product, label: str):
        super().__init__(product)
        self.label = label

    def __str__(self) -> str:
        return f"{super().__str__()} - {self.label}"

# Example usage of Decorator Pattern
def create_discounted_product(product: Product, discount_percentage: float) -> ProductDecorator:
    """Creates a discounted product using the decorator pattern."""
    return DiscountDecorator(product, discount_percentage)

def create_special_label_product(product: Product, label: str) -> ProductDecorator:
    """Creates a product with a special label using the decorator pattern."""
    return SpecialLabelDecorator(product, label)

# Example usage

# Assuming you have an existing product
product = Product(
    name="Handmade Vase",
    description="A beautiful handmade vase from artisan craftsmen.",
    price=50.00,
    category="Home Decor",
    stock=100,
)

# Apply discount
discounted_product = create_discounted_product(product, discount_percentage=20)

# Apply special label
labeled_product = create_special_label_product(product, label="Limited Edition")

# Print original product
print(f"Original Product: {product}")
print(f"Original Price: ${product.price:.2f}")

# Print discounted product
print(f"Discounted Product: {discounted_product}")
print(f"Discounted Price: ${discounted_product.get_price():.2f}")

# Print product with special label
print(f"Labeled Product: {labeled_product}")
