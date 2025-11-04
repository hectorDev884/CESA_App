from django.urls import path
from .views import OficioCreateAPIView, OficioListAPIView

urlpatterns = [
    path('generar/', OficioCreateAPIView.as_view(), name='generar-oficio'),
    
    path('lista/', OficioListAPIView.as_view(), name='oficios-lista'),
]