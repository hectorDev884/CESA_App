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