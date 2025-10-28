from django.db import models

# --- Tabla 1: Oficio (Registro principal de cada documento) ---
class Oficio(models.Model):
    # Campo que guarda el número completo generado, ej: 'Oficio NO. C.E.S.A. S004'
    numero_oficio_completo = models.CharField(
        max_length=100, 
        unique=True, 
        editable=False # No se edita directamente desde el admin, lo genera el sistema
    )
    
    # Opciones para el tipo de oficio
    TIPO_CHOICES = [
        ('S', 'Solicitud'),
        ('I', 'Invitación'),
        ('J', 'Justificante'),
    ]
    tipo_oficio = models.CharField(
        max_length=1, 
        choices=TIPO_CHOICES,
        verbose_name="Tipo de Oficio"
    )
    
    asunto = models.CharField(max_length=255, verbose_name="Asunto")
    destinatario = models.CharField(max_length=200, verbose_name="Destinatario")
    cuerpo_texto = models.TextField(verbose_name="Cuerpo del Oficio")
    
    fecha_creacion = models.DateField(auto_now_add=True)
    
    documento_pdf = models.FileField(
        upload_to='oficios/pdf/', 
        null=True, 
        blank=True,
        verbose_name="Documento PDF"
    ) 

    class Meta:
        verbose_name = "Oficio"
        verbose_name_plural = "Oficios"

    def __str__(self):
        return self.numero_oficio_completo

# -----------------------------------------------------------------

# --- Tabla 2: ContadorOficios (Maneja la secuencia numérica) ---
class ContadorOficios(models.Model):
    # Prefijo que identifica el tipo (ej: 'S', 'I', 'J')
    prefijo = models.CharField(
        max_length=10, 
        unique=True,
        verbose_name="Prefijo (S, I, J, etc.)"
    )
    # El número actual que va, ej: 4
    contador = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Contador de Oficio"
        verbose_name_plural = "Contadores de Oficios"

    def __str__(self):
        return f"Contador {self.prefijo}: {self.contador}"
