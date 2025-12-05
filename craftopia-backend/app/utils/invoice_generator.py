"""
Invoice Generator
SRP: Responsible ONLY for generating invoice PDFs
"""
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
import io
from app.models.order import Order


class InvoiceGenerator:
    """
    Generates invoice PDFs for orders
    SRP: Single responsibility - invoice generation
    """
    
    def generate_pdf(self, order: Order) -> io.BytesIO:
        """Generate invoice PDF for an order"""
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter)
        elements = []
        
        styles = getSampleStyleSheet()
        title_style = styles['Heading1']
        normal_style = styles['Normal']
        
        # Title
        elements.append(Paragraph("INVOICE", title_style))
        elements.append(Spacer(1, 0.25 * inch))
        
        # Order Information
        elements.append(Paragraph(f"Order ID: {order.id}", normal_style))
        elements.append(Paragraph(
            f"Date: {order.createdAt.strftime('%Y-%m-%d')}",
            normal_style
        ))
        elements.append(Paragraph(f"Status: {order.status}", normal_style))
        elements.append(Spacer(1, 0.25 * inch))
        
        # Items Table
        data = [['Item', 'Quantity', 'Price', 'Total']]
        
        for item in order.items:
            item_total = item.price * item.quantity
            data.append([
                item.name,
                str(item.quantity),
                f"Rs {item.price:.2f}",
                f"Rs {item_total:.2f}"
            ])
        
        # Add subtotal, discount, tax, total
        data.append(['', '', 'Subtotal:', f"Rs {order.subtotal:.2f}"])
        data.append(['', '', 'Discount:', f"Rs {order.discount:.2f}"])
        data.append(['', '', 'Tax:', f"Rs {order.tax:.2f}"])
        data.append(['', '', 'Total:', f"Rs {order.total:.2f}"])
        
        # Create and style table
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -2), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.25 * inch))
        
        # Footer
        elements.append(Paragraph("Thank you for your business!", normal_style))
        
        # Build PDF
        doc.build(elements)
        buffer.seek(0)
        return buffer