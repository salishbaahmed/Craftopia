from app.utils.invoice_generator import generate_invoice_pdf
from datetime import datetime

class MockItem:
    def __init__(self, name, price, quantity):
        self.product_name = name
        self.price = price
        self.quantity = quantity

class MockOrder:
    def __init__(self):
        self.id = "TEST-ORDER-123"
        self.createdAt = datetime.now()
        self.status = "confirmed"
        self.items = [
            MockItem("Test Product 1", 100, 2),
            MockItem("Test Product 2", 50, 1)
        ]

try:
    order = MockOrder()
    pdf_buffer = generate_invoice_pdf(order)
    with open("test_invoice.pdf", "wb") as f:
        f.write(pdf_buffer.getvalue())
    print("PDF generated successfully: test_invoice.pdf")
except Exception as e:
    print(f"Error generating PDF: {e}")
    import traceback
    traceback.print_exc()
