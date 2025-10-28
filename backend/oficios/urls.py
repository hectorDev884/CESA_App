from django.urls import path
from .views import OficioCreateAPIView

urlpatterns = [
    path('oficios/generar/', OficioCreateAPIView.as_view(), name='generar-oficio'),
]