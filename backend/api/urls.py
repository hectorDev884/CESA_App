from django.urls import path, include
from rest_framework import routers
from api.views import EstudianteViewSet, BecaViewSet

router = routers.DefaultRouter()

router.register(r'estudiantes', EstudianteViewSet, basename='estudiante')
router.register(r'becas', BecaViewSet, basename='beca')

urlpatterns = [
    path('api/', include(router.urls))
]