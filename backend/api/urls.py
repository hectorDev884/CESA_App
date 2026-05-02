from django.urls import path, include
from rest_framework import routers
from api.views import (
    EstudianteViewSet, BecaViewSet, AsistenciaBecaViewSet,
    generar_pdf_asistencia, generar_pdf_asistencia_general,
    reporte_becas, exportar_becas_excel,
)

router = routers.DefaultRouter()

router.register(r'estudiantes', EstudianteViewSet, basename='estudiante')
router.register(r'becas', BecaViewSet, basename='beca')
router.register(r'asistencias', AsistenciaBecaViewSet, basename='asistencia')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/pdf/asistencia/', generar_pdf_asistencia, name="generar_pdf_asistencia"),
    path('api/pdf/asistencia_general/', generar_pdf_asistencia_general, name="generar_pdf_asistencia_general"),
    path('api/reportes/becas/', reporte_becas, name="reporte_becas"),
    path('api/reportes/becas/exportar/', exportar_becas_excel, name="exportar_becas_excel"),
]