from django.urls import path
from . import views

urlpatterns = [
    path('api/backup/generar/', views.generar_backup, name="backup")
]