from django.db import models

class Estudiante(models.Model):
    numero_control = models.IntegerField(primary_key=True)
    nombre = models.CharField(max_length=200)
    apellido = models.CharField(max_length=200)
    email = models.EmailField()
    carrera = models.CharField(max_length=200, blank=True, null=True)
    semestre = models.SmallIntegerField(blank=True, null=True)
    telefono = models.CharField(max_length=50, blank=True, null=True)
    fecha_registro = models.DateTimeField(blank=True, null=True)

    class Meta:
        db_table = 'estudiante'  # nombre exacto de la tabla en Supabase
        managed = False          # Django no la crea ni modifica
        
    def __str__(self):
        return self.nombre
    
from django.db import models

class Beca(models.Model):
    beca_id = models.AutoField(primary_key=True)  # Se asume serial/nextval en PostgreSQL
    numero_control = models.ForeignKey(Estudiante, 
                                       on_delete=models.CASCADE, 
                                       db_column='numero_control', 
                                       null=True, 
                                       blank=True, 
                                       related_name='becas')
    tipo_beca = models.CharField(max_length=255, null=True, blank=True)
    fecha_solicitud = models.DateField(null=True, blank=True)
    fecha_aprobacion = models.DateField(null=True, blank=True)
    fecha_entrega = models.DateField(null=True, blank=True)
    estatus = models.CharField(max_length=50, default='pendiente')
    observaciones = models.TextField(null=True, blank=True)
    notas_internas = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'beca'
        managed = False

    def __str__(self):
        return f"{self.tipo_beca} - {self.estatus}"
