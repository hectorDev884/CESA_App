import io
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from django.core.files.base import ContentFile

try: 
    pdfmetrics.registerFont(TTFont('Arial', 'arial.ttf'))
    pdfmetrics.registerFont(TTFont('Arial-Bold', 'arialbd.ttf'))
    FONT_NAME = 'Arial'
    FONT_NAME_BOLD = 'Arial-Bold'
except:
    FONT_NAME = 'Helvetica'
    FONT_NAME_BOLD = 'Helvetica-Bold'

def generar_pdf_oficio(oficio_obj):
    styles = getSampleStyleSheet()

    # Información del oficio
    styles.add(ParagraphStyle(
        name='Base',
        fontName=FONT_NAME,
        fontSize=10,
        leading=15,
        alignment=TA_LEFT
    ))

    # Cuerpo del oficio
    styles.add(ParagraphStyle(
        name='Justificado',
        parent=styles['Base'],
        alignment=TA_JUSTIFY
    ))

    # Atentamente
    styles.add(ParagraphStyle(
        name='Atentamente',
        parent=styles['Base'],
        fontName=FONT_NAME_BOLD,
        alignment=TA_RIGHT
    ))

    # Creación de Buffer y documento
    buffer = io.BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        leftMargin=inch,
        rightMargin=inch,
        topMargin=inch,
        bottomMargin=inch
    )

    story = []

    # ------------------ MEMBRETE DEL OFICIO ------------------
    # TecNM Logo
    story.append(Paragraph("<b>TecNM</b>", styles['Base']))
    story.append(Spacer(1, 15))

    # ITCG Logo
    # story.append(Paragraph("<b>ITCG</b>", styles['Base']))
    # story.append(Spacer(1, 15))
    
    # CESA Logo
    # story.append(Paragraph("<b>CESA</b>", styles['Base']))
    # story.append(Spacer(1, 15))
    
    # ------------------ INFORMACIÓN SUPERIOR ------------------
    # Locación
    story.append(Paragraph("Instituto Tecnológico de Ciudad Guzmán / Tecnológico Nacional de México", styles['Base']))
    story.append(Spacer(1, 15))

    # Fecha e información del documento
    fecha_formato = oficio_obj.fecha_creacion.strftime("%d de %B de %Y")
    story.append(Paragraph(f"Ciudad Guzmán, Jalisco a {fecha_formato}", styles['Base']))
    story.append(Spacer(1, 30))

    #Info Oficio
    tipo_letra = oficio_obj.tipo_oficio
    num_completo = oficio_obj.numero_oficio_completo.split()[-1]

    oficio_line = f"OFICIO No. C.E.S.A./{tipo_letra}{num_completo}/2025"
    story.append(Paragraph(oficio_line, styles['Base']))
    story.append(Spacer(1, 15))

    # Asunto
    story.append(Paragraph(f"<b>Asunto:</b> {oficio_obj.asunto}", styles['Base']))
    story.append(Spacer(1, 30))

    # ------------------ CUERPO DEL OFICIO ------------------
    cuerpo_oficio_text = oficio_obj.cuerpo_texto

    parrafo_cuerpo = cuerpo_oficio_text.replace('\n', '<br/><br/>')
    story.append(Paragraph(parrafo_cuerpo, styles['Justificado']))
    story.append(Spacer(1,30))

    # ------------------ ATENTAMENTE Y FIRMA ------------------
    story.append(Paragraph("ATENTAMENTE", styles['Atentamente']))
    story.append(Spacer(1, 30))

    story.append(Paragraph("Comité Ejecutivo de la Sociedad de Alumnos", styles['Atentamente']))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("C. Jairo Giovanni Álvarez Juárez", styles['Atentamente']))
    story.append(Paragraph("Presidente del C.E.S.A. ITCG", styles['Atentamente']))

    # ------------------ PIE DE PÁGINA ------------------
    story.append(Spacer(1, 80))

    story.append(Paragraph("<b>Contacto:</b>", styles['Base']))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph(f"Correo: cesa@cdguzman.tecnm.mx", styles['Base']))
    story.append(Paragraph(f"Teléfono: 33 1025 9280", styles['Base']))

    # ------------------ CONSTRUCCÓN DEL DOC ------------------
    doc.build(story)

    buffer.seek(0)

    filename = f"{oficio_obj.numero_oficio_completo.replace(' ', '_').replace('.', '').pdf}"

    oficio_obj.documento_pdf.save(filename, ContentFile(buffer.getvalue(), save=False))

    return oficio_obj.documento_pdf.name