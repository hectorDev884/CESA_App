from django.urls import path
from . import views

urlpatterns = [
    path('backup/generar/', views.generar_backup, name="backups")
]