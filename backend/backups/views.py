# backup/views.py
import subprocess
from django.http import HttpResponse, HttpResponseBadRequest
from django.conf import settings

def generar_backup(request):
    name = request.GET.get("name")

    if not name:
        return HttpResponseBadRequest("Parametro 'name' requerido")

    # 🔥 CONEXIÓN DIRECTA YA CARGADA EN settings.py
    connection_url = settings.DATABASE_URL  # <-- Aquí ya existe la cadena completa

    try:
        # Ejecutar pg_dump
        dump = subprocess.Popen(
            ["pg_dump", connection_url],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        output, error = dump.communicate()

        if dump.returncode != 0:
            return HttpResponse(f"Error al generar backup:\n{error.decode()}", status=500)

        # Crear respuesta como archivo .sql
        response = HttpResponse(output, content_type="application/sql")
        response["Content-Disposition"] = f'attachment; filename="{name}.sql"'

        return response

    except Exception as e:
        return HttpResponse(f"Error interno: {e}", status=500)
