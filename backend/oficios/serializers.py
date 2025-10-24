from rest_framework import serializers
from .models import Oficio

class OficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oficio
        fields = ['tipo_oficio', 'asunto', 'destinatario', 'cuerpo_texto']