from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import io

def generate_invoice_pdf(order_data):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    title_style = styles['Heading1']
    normal_style = styles['Normal']
    
    # Title
    elements.append(Paragraph("INVOICE", title_style))
    elements.append(Spacer(1, 0.25*inch))
    
    # Order Info
    elements.append(Paragraph(f"Order ID: {order_data.id}", normal_style))
    elements.append(Paragraph(f"Date: {order_data.createdAt.strftime('%Y-%m-%d')}", normal_style))
    elements.append(Paragraph(f"Status: {order_data.status}", normal_style))
    elements.append(Spacer(1, 0.25*inch))
    
    # Customer Info (if available, otherwise generic)
    # Assuming order_data has user relationship or we pass user data separately.
    # For now, let's keep it simple based on what we have in the order object usually.
    
    # Items Table
    data = [['Item', 'Quantity', 'Price', 'Total']]
    
    total_amount = 0
    for item in order_data.items:
        item_total = item.price * item.quantity
        total_amount += item_total
        data.append([
            item.name, # Changed from product_name to name
            str(item.quantity),
            f"Rs {item.price}",
            f"Rs {item_total}"
        ])
    
    # Total Row
    data.append(['', '', 'Total:', f"Rs {total_amount}"])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))
    
    elements.append(table)
    elements.append(Spacer(1, 0.25*inch))
    
    elements.append(Paragraph("Thank you for your business!", normal_style))
    
    doc.build(elements)
    buffer.seek(0)
    return buffer
