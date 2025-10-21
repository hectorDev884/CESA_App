from rest_framework import serializers
from .models import Estudiante, Beca

class BecaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Beca
        fields = [
            'beca_id', 'numero_control', 'tipo_beca', 
            'fecha_solicitud', 'fecha_aprobacion', 'fecha_entrega',
            'estatus', 'observaciones', 'notas_internas',
        ]

class EstudianteSerializer(serializers.ModelSerializer):
    becas = BecaSerializer(many=True, read_only=True)
    class Meta:
        model = Estudiante
        fields = [
            'numero_control', 'nombre', 'apellido',
            'email', 'carrera', 'semestre', 'telefono',
            'fecha_registro', 'becas'
        ]