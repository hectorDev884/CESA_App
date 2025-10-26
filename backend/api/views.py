from rest_framework import viewsets
from api.models import Estudiante, Beca, AsistenciaBeca
from api.serializers import EstudianteSerializer, BecaSerializer, AsistenciaBecaSerializer
from rest_framework.filters import SearchFilter, OrderingFilter
from django.http import HttpResponse, HttpResponseBadRequest
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from reportlab.lib.units import mm
from datetime import datetime, timedelta

WEEKDAY_NAMES = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"]

def generar_pdf_asistencia(request):
    """
    GET /api/pdf/asistencia/?nc=22290697&nombre=Alan%20Emiliano&fecha_inicio=2025-10-01&fecha_fin=2025-10-31&color=green
    """
    nc = request.GET.get("nc")
    nombre = request.GET.get("nombre", "")
    start = request.GET.get("fecha_inicio", datetime.today())
    end = request.GET.get("fecha_fin", "2025-10-31")
    color_param = request.GET.get("color", "red")  # color dinámico

    if not (nc and start and end):
        return HttpResponseBadRequest("Faltan parámetros: nc, start, end")

    try:
        fecha_inicio = datetime.strptime(start, "%Y-%m-%d").date()
        fecha_fin = datetime.strptime(end, "%Y-%m-%d").date()
    except ValueError:
        return HttpResponseBadRequest("Fechas deben tener formato YYYY-MM-DD")

    if fecha_fin < fecha_inicio:
        return HttpResponseBadRequest("La fecha fin debe ser posterior o igual a la fecha inicio")

    # Colores predefinidos
    COLOR_MAP = {
    "red": (0.75, 0.12, 0.15),
    "green": (0.0, 0.6, 0.3),
    "blue": (0.0, 0.3, 0.7),
    "orange": (1.0, 0.5, 0.0),
    "purple": (0.5, 0.0, 0.5),
    "teal": (0.0, 0.5, 0.5),
    "yellow": (1.0, 0.9, 0.0),
    "pink": (1.0, 0.4, 0.6),
    "gray": (0.5, 0.5, 0.5),
    "brown": (0.6, 0.4, 0.2),
}

    header_color = COLOR_MAP.get(color_param.lower(), (0.75, 0.12, 0.15))

    # Calcular primer lunes
    primer_lunes = fecha_inicio - timedelta(days=fecha_inicio.weekday())
    semanas = []
    cursor = primer_lunes
    while cursor <= fecha_fin:
        semana = []
        for d in range(5):
            dia_fecha = cursor + timedelta(days=d)
            if fecha_inicio <= dia_fecha <= fecha_fin:
                fecha_str = dia_fecha.strftime("%d/%m/%Y")
                semana.append({"dia": WEEKDAY_NAMES[d], "fecha": fecha_str})
            else:
                semana.append({"dia": WEEKDAY_NAMES[d], "fecha": ""})
        semanas.append(semana)
        cursor += timedelta(weeks=1)

    # --- Crear PDF ---
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'inline; filename="asistencia_{nc}.pdf"'

    pdf = canvas.Canvas(response, pagesize=A4)
    width, height = A4

    # Márgenes
    left_margin = 20 * mm
    right_margin = 20 * mm
    top_margin = 20 * mm
    usable_width = width - left_margin - right_margin
    header_height = 18 * mm

    # Dibujar header
    pdf.setFillColorRGB(*header_color)
    pdf.rect(left_margin, height - top_margin - header_height, usable_width, header_height, stroke=0, fill=1)

    # Título centrado
    pdf.setFillColor(colors.white)
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawCentredString(left_margin + usable_width / 2, height - top_margin - header_height/2 + 4, "FORMATO DE ASISTENCIA")

    # Datos estudiante
    pdf.setFillColor(colors.black)
    pdf.setFont("Helvetica", 11)
    y = height - top_margin - header_height - 12
    pdf.drawString(left_margin, y, f"NC: {nc}")
    pdf.drawString(left_margin + 220, y, f"Nombre completo: {nombre}")
    y -= 16
    pdf.drawString(left_margin, y, f"Período: {fecha_inicio.strftime('%d/%m/%Y')} — {fecha_fin.strftime('%d/%m/%Y')}")
    y -= 22

    # Preparar tabla
    col_width = usable_width / 5.0
    col_widths = [col_width] * 5
    data = []
    for semana in semanas:
        fila_fechas = []
        for cel in semana:
            texto = cel["dia"]
            if cel["fecha"]:
                texto = f"{texto}\n{cel['fecha']}"
            fila_fechas.append(texto)
        data.append(fila_fechas)
        data.append([""]*5)

    if not data:
        data = [[f"{d}\n" for d in WEEKDAY_NAMES], [""]*5]

    table = Table(data, colWidths=col_widths)
    fila_alto_fecha = 12 * mm
    fila_alto_firma = 20 * mm
    row_heights = [fila_alto_fecha if i % 2 == 0 else fila_alto_firma for i in range(len(data))]

    style = TableStyle([
        ("GRID", (0,0), (-1,-1), 0.6, colors.black),
        ("ALIGN", (0,0), (-1,-1), "CENTER"),
        ("VALIGN", (0,0), (-1,-1), "MIDDLE"),
        ("FONTNAME", (0,0), (-1,-1), "Helvetica"),
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("BACKGROUND", (0,0), (-1,0), colors.whitesmoke),
    ])
    table.setStyle(style)

    # Dibujar tabla manejando paginado
    pdf_y_start = y
    current_row = 0
    total_rows = len(data)
    while current_row < total_rows:
        remaining_height = pdf_y_start - 40
        h_sum = 0
        rows_fit = 0
        for r in range(current_row, total_rows):
            h_sum += row_heights[r]
            if h_sum <= remaining_height:
                rows_fit += 1
            else:
                break
        if rows_fit == 0:
            rows_fit = 1

        sub_data = data[current_row: current_row + rows_fit]
        sub_heights = row_heights[current_row: current_row + rows_fit]
        sub_table = Table(sub_data, colWidths=col_widths, rowHeights=sub_heights)
        sub_table.setStyle(style)
        sub_table.wrapOn(pdf, left_margin, pdf_y_start)
        sub_table.drawOn(pdf, left_margin, pdf_y_start - sum(sub_heights))

        pdf_y_start = pdf_y_start - sum(sub_heights) - 10
        current_row += rows_fit

        if current_row < total_rows:
            pdf.showPage()
            pdf.setFillColorRGB(*header_color)
            pdf.rect(left_margin, height - top_margin - header_height, usable_width, header_height, stroke=0, fill=1)
            pdf.setFillColor(colors.white)
            pdf.setFont("Helvetica-Bold", 14)
            pdf.drawCentredString(left_margin + usable_width / 2, height - top_margin - header_height/2 + 4, "FORMATO DE ASISTENCIA")
            pdf.setFillColor(colors.black)
            pdf.setFont("Helvetica", 11)
            y_page = height - top_margin - header_height - 12
            pdf.drawString(left_margin, y_page, f"NC: {nc}")
            pdf.drawString(left_margin + 220, y_page, f"Nombre completo: {nombre}")
            y_page -= 16
            pdf.drawString(left_margin, y_page, f"Período: {fecha_inicio.strftime('%d/%m/%Y')} — {fecha_fin.strftime('%d/%m/%Y')}")
            pdf_y_start = y_page - 22

    # Firma encargado
    final_y = 40
    pdf.setFont("Helvetica", 11)
    pdf.drawString(left_margin, final_y, "Firma del encargado: _______________________________")

    pdf.showPage()
    pdf.save()

    return response

class EstudianteViewSet(viewsets.ModelViewSet):
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['numero_control', 'nombre', 'apellido', 'email', ]
    ordering_fields = ['numero_control', 'apellido', 'nombre', 'fecha_registro', ]
    ordering = ['apellido', 'nombre']
    
class BecaViewSet(viewsets.ModelViewSet):
    queryset = Beca.objects.all()
    serializer_class = BecaSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['tipo_beca', 'estatus', 'numero_control__numero_control', 
                     'numero_control__nombre', 'numero_control__apellido']
    ordering_fields = ['tipo_beca', 'estatus']

class AsistenciaBecaViewSet(viewsets.ModelViewSet):
    queryset = AsistenciaBeca.objects.all()
    serializer_class = AsistenciaBecaSerializer
    filter_backends = [SearchFilter]
    search_fields = ['beca_id__beca_id', 'asistencia_id']
    