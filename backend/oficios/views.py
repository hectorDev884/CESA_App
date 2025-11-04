from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Oficio, ContadorOficios
from .serializers import OficioSerializer
from .pdf_utils import generar_pdf_oficio

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

@method_decorator(csrf_exempt, name='dispatch')
class OficioCreateAPIView(APIView):
    def post(self, request, *args, **kwargs):
        # Validación de datos
        serializer = OficioSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        tipo_recibido = serializer.validated_data.get('tipo_oficio').strip().upper()

        try:
            with transaction.atomic():
                # Numeración secuencial
                contador_obj = ContadorOficios.objects.select_for_update().get(prefijo=tipo_recibido)

                contador_obj.contador += 1
                contador_obj.save()

                nuevo_numero = f"{contador_obj.contador:03d}"
                numero_oficio_completo = f"OFICIO N0. C.E.S.A./{tipo_recibido}{nuevo_numero}/2025"

                # Crear el obj oficio en la BD
                oficio = serializer.save(numero_oficio_completo=numero_oficio_completo)

                # Generar .pdf
                pdf_file_path = generar_pdf_oficio(oficio)
                oficio.documento_pdf.name = pdf_file_path
                oficio.save()

                # Responder con éxito y URL de descarga
                return Response({
                    "mensaje": "Oficio generado y guardado con éxito.",
                    "numero_oficio": numero_oficio_completo,
                    "url_descarga": oficio.documento_pdf.url
                }, status=status.HTTP_201_CREATED)
        except ContadorOficios.DoesNotExist:
            return Response({"error": f"Contador para prefijo '{tipo_recibido}' no encontrado. Inicialícelo."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
