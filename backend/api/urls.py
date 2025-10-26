from django.urls import path, include
from rest_framework import routers
from api.views import EstudianteViewSet, BecaViewSet, AsistenciaBecaViewSet, generar_pdf_asistencia

router = routers.DefaultRouter()

router.register(r'estudiantes', EstudianteViewSet, basename='estudiante')
router.register(r'becas', BecaViewSet, basename='beca')
router.register(r'asistencias', AsistenciaBecaViewSet, basename='asistencia')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/pdf/asistencia/', generar_pdf_asistencia, name="generar_pdf_asistencia")
]