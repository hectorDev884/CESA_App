from rest_framework import serializers
from .models import Estudiante, Beca, AsistenciaBeca

class EstudianteMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estudiante
        fields = ['numero_control', 'nombre', 'apellido']
        
class AsistenciaBecaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AsistenciaBeca
        fields = [
            'asistencia_id', 'fecha_inicio', 'fecha_fin', 'beca_id'
        ]
        
class BecaSerializer(serializers.ModelSerializer):
    estudiante = EstudianteMiniSerializer(source='numero_control', read_only=True)
    asistencias = AsistenciaBecaSerializer(many=True, read_only=True)
    
    class Meta:
        model = Beca
        fields = [
            'beca_id', 'numero_control', 'tipo_beca', 
            'fecha_solicitud', 'fecha_aprobacion', 'fecha_entrega', 'fecha_fin',
            'estatus', 'observaciones', 'notas_internas', 'estudiante', 'asistencias'
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

