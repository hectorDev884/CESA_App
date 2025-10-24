from rest_framework import viewsets
from api.models import Estudiante, Beca, AsistenciaBeca
from api.serializers import EstudianteSerializer, BecaSerializer, AsistenciaBecaSerializer
from rest_framework.filters import SearchFilter, OrderingFilter


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
    