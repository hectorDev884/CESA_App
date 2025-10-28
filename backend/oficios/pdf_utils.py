import io
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase.ttfonts import TTFont
from django.core.files.base import ContentFile
from reportlab.lib.utils import ImageReader
from django.conf import settings

IMAGENES_DIR = settings.BASE_DIR / 'assets'

def header_footer_callback(canvas, doc):
    canvas.saveState()

    # --- Configuración de Unidades y Constantes ---
    PAGE_WIDTH = doc.pagesize[0]
    PAGE_HEIGHT = doc.pagesize[1]
    LEFT_MARGIN = doc.leftMargin
    RIGHT_MARGIN = doc.rightMargin

    # LOGO TecNM
    TECNM_WIDTH = 2.57 * cm
    TECNM_HEIGHT = 1.27 * cm
    TECNM_X = 2.54 * cm
    TECNM_Y = 1.27 * cm  # La posición Y es la distancia desde el BORDE INFERIOR

    # LOGO ITCG
    ITCG_WIDTH = 1.15 * cm
    ITCG_HEIGHT = 1.15 * cm
    ITCG_X = 10.22 * cm
    ITCG_Y = 1.27 * cm

    # LOGO CESA
    CESA_WIDTH = 2.27 * cm
    CESA_HEIGHT = 1.36 * cm
    CESA_X = 16.78 * cm
    CESA_Y = 1.27 * cm

    # Altura de la página (tamaño 'letter' es ~27.94 cm o 11 inches)
    PAGE_HEIGHT = doc.pagesize[1]

    DISTANCIA_DESDE_BORDE_SUPERIOR = 1.27 * cm
    
    # Posición Y para el logo, usando la altura más grande (CESA) para alineación visual, 
    # o mejor, definiendo una línea de base para todos.
    BASE_Y = PAGE_HEIGHT - DISTANCIA_DESDE_BORDE_SUPERIOR - CESA_HEIGHT - 0.2 * cm

    # ---------------- DIBUJAR LOGO 1: TecNM (Izq) ----------------
    try:
        tecnm_path = str(IMAGENES_DIR / 'logo_TecNM.png')
        logo_tecnm = ImageReader(tecnm_path)
        
        # El borde inferior del logo estará en BASE_Y
        canvas.drawImage(logo_tecnm, TECNM_X, BASE_Y + (CESA_HEIGHT - TECNM_HEIGHT)/2, 
                         width=TECNM_WIDTH, height=TECNM_HEIGHT, mask='auto')
    except Exception as e:
        canvas.setFont(FONT_NAME_BOLD, 8)
        canvas.drawString(TECNM_X, BASE_Y, f"TecNM Logo Error: {e}")

    # ---------------- DIBUJAR LOGO 2: ITCG (Centro) ----------------
    try:
        itcg_path = str(IMAGENES_DIR / 'logo_ITCG.jpeg')
        logo_itcg = ImageReader(itcg_path)
        
        # El borde inferior del logo estará en BASE_Y
        canvas.drawImage(logo_itcg, ITCG_X, BASE_Y + (CESA_HEIGHT - ITCG_HEIGHT)/2, 
                         width=ITCG_WIDTH, height=ITCG_HEIGHT, mask='auto')
    except Exception as e:
        canvas.setFont(FONT_NAME_BOLD, 8)
        canvas.drawString(ITCG_X, BASE_Y, f"ITCG Logo Error: {e}")
    # ---------------- DIBUJAR LOGO 3: CESA (Derecha) ----------------
    try:
        cesa_path = str(IMAGENES_DIR / 'logo_CESA.png')
        logo_cesa = ImageReader(cesa_path)
        
        # El borde inferior del logo estará en BASE_Y
        canvas.drawImage(logo_cesa, CESA_X, BASE_Y + (CESA_HEIGHT - CESA_HEIGHT)/2, 
                         width=CESA_WIDTH, height=CESA_HEIGHT, mask='auto')
    except Exception as e:
        canvas.setFont(FONT_NAME_BOLD, 8)
        canvas.drawString(CESA_X, BASE_Y, f"CESA Logo Error: {e}")
    
    # --------------------------------------------------------
    #             SECCIÓN DE PIE DE PÁGINA (Footer)
    # --------------------------------------------------------

    FOOTER_FONT_SIZE = 8
    FOOTER_LINE_Y = 0.8 * cm  # Distancia desde el borde inferior de la página (22.68 pt)
    TEXT_LINE_HEIGHT = 10     # Espaciado entre líneas del texto del contacto
    # --- 1. Información de Contacto (Izquierda) ---
    
    # Posición inicial Y para el texto de contacto (justo debajo de la línea separadora)
    contacto_y_pos = FOOTER_LINE_Y + (2 * TEXT_LINE_HEIGHT)
    
    canvas.setFont(FONT_NAME_BOLD, FOOTER_FONT_SIZE)
    canvas.drawString(LEFT_MARGIN, contacto_y_pos + (2 * TEXT_LINE_HEIGHT), "Contacto:")
    
    canvas.setFont(FONT_NAME, FOOTER_FONT_SIZE)
    canvas.drawString(LEFT_MARGIN, contacto_y_pos + TEXT_LINE_HEIGHT, "Correo: cesa@cdguzman.tecnm.mx")
    canvas.drawString(LEFT_MARGIN, contacto_y_pos, "Teléfono: 33 1025 9280")
    
    
    # --- 2. Contador de Página (Derecha) ---
    
    # Obtiene el número de página actual y el total (ReportLab necesita un pase de construcción para el total)
    # El objeto doc.pageTemplate tiene la información del contador
    page_num = canvas.getPageNumber()
    
    # Si quieres el formato "Página 1 de 5", necesitas el total (requiere dos pasadas o código más complejo).
    # Para la primera pasada (pass 0), el total es desconocido, así que solo usamos el número actual.
    # El método más simple para el formato "Página N de M" es usando la marca de agua (alias), pero
    # para mantenerlo simple en el callback:
    
    page_text = f"Página {page_num}" # Se ajustará a "Página N de M" más tarde si se necesita el total.
    
    # Si usas SimpleDocTemplate, puedes establecer un alias para el total de páginas
    # que se resuelve después de que el documento se construye la primera vez.
    
    # Usaremos el alias simple para el total de páginas: #PÁGINAS#
    # El texto completo se resolverá después de la construcción.
    # Por ahora, dejamos la marca para que ReportLab la resuelva:
    page_total_alias = f"Página {page_num} de <pdf:pages/>"
    
    canvas.setFont(FONT_NAME, FOOTER_FONT_SIZE)
    
    # Posición X derecha: Anchura total menos el margen derecho menos la anchura del texto
    # Usamos stringWidth para calcular dónde empezar a dibujar el texto para que termine en el margen derecho.
    text_width = stringWidth(page_total_alias.replace('<pdf:pages/>', '99'), FONT_NAME, FOOTER_FONT_SIZE) # Estimamos el ancho
    right_x = PAGE_WIDTH - RIGHT_MARGIN - text_width
    
    # Dibuja el texto del contador (ReportLab resolverá <pdf:pages/> automáticamente)
    canvas.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, FOOTER_LINE_Y + TEXT_LINE_HEIGHT, page_total_alias)
    
    canvas.restoreState()

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
        alignment=TA_RIGHT
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
        alignment=TA_LEFT
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
    story.append(Spacer(1, 15))

    # ------------------ INFORMACIÓN SUPERIOR ------------------
    # Locación
    story.append(Paragraph("Instituto Tecnológico de Ciudad Guzmán / Tecnológico Nacional de México", styles['Base']))

    # Fecha e información del documento
    fecha_formato = oficio_obj.fecha_creacion.strftime("%d de %B de %Y")
    story.append(Paragraph(f"Ciudad Guzmán, Jalisco a {fecha_formato}", styles['Base']))

    #Info Oficio
    tipo_letra = oficio_obj.tipo_oficio
    num_completo = oficio_obj.numero_oficio_completo.split()[-1]

    oficio_line = f"OFICIO No. {num_completo}"
    story.append(Paragraph(oficio_line, styles['Base']))

    # Asunto
    story.append(Paragraph(f"<b>Asunto:</b> {oficio_obj.asunto}", styles['Base']))

    # ------------------ DESTINATARIO ------------------
    destinatario = oficio_obj.destinatario

    destinatario_oficio = destinatario
    story.append(Paragraph(destinatario_oficio, styles['Atentamente']))
    story.append(Spacer(1,15))

    # ------------------ CUERPO DEL OFICIO ------------------
    cuerpo_oficio_text = oficio_obj.cuerpo_texto

    parrafo_cuerpo = cuerpo_oficio_text.replace('\n', '<br/><br/>')
    story.append(Paragraph(parrafo_cuerpo, styles['Justificado']))
    story.append(Spacer(1,30))

    # ------------------ ATENTAMENTE Y FIRMA ------------------
    story.append(Paragraph("ATENTAMENTE", styles['Atentamente']))
    story.append(Paragraph("Comité Ejecutivo de la Sociedad de Alumnos", styles['Atentamente']))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("C. JAIRO GIOVANNI ÁLVAREZ JUÁREZ", styles['Atentamente']))
    story.append(Paragraph("Presidente del C.E.S.A. ITCG", styles['Atentamente']))

    # ------------------ PIE DE PÁGINA ------------------

    # ------------------ CONSTRUCCÓN DEL DOC ------------------
    doc.build(
        story,
        onFirstPage=header_footer_callback,
        onLaterPages=header_footer_callback
        )

    buffer.seek(0)

    filename = f"{oficio_obj.numero_oficio_completo.replace(' ', '_').replace('.', '')}.pdf"

    oficio_obj.documento_pdf.save(filename, ContentFile(buffer.getvalue()), save=False)

    return oficio_obj.documento_pdf.name