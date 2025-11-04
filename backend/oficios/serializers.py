from rest_framework import serializers
from .models import Oficio

class OficioSerializer(serializers.ModelSerializer):
    documento_pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = Oficio
        fields = [
            'id',
            'numero_oficio_completo',
            'tipo_oficio',
            'asunto',
            'destinatario',
            'cuerpo_texto',
            'fecha_creacion',
            'documento_pdf',
            'documento_pdf_url'
            ]
        read_only_fields = ['documento_pdf_url']

    def get_documento_pdf_url(self, obj):
        # 1. Obtener el request del contexto (pasado desde la vista)
        request = self.context.get('request')

        if not obj.documento_pdf:
            return None
        
        # 2. Construir la URL completa: http:// + host + URL relativa
        #    request.build_absolute_uri() construye la URL base (http://127.0.0.1:8000)
        #    obj.documento_pdf.url ya contiene la ruta relativa (/media/...)
        return request.build_absolute_uri(obj.documento_pdf.url)