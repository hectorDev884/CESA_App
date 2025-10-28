# Módulo de Gestión de Miembros

Este módulo forma parte de CESA_App y se encarga de la gestión de miembros e interacciones entre departamentos.

## 🚀 Características

- ✅ Registro y gestión de miembros
- 📝 Seguimiento de interacciones entre departamentos
- 🔍 Búsqueda avanzada de miembros
- 📊 Vista de resumen y estadísticas

## 💻 Estructura del Módulo

```
src/
├── components/
│   ├── MiembrosModal.jsx       # Componente principal de listado
│   ├── EditarMiembroModal.jsx  # Modal para crear/editar miembros
│   └── InteraccionModal.jsx    # Modal para gestionar interacciones
├── pages/
│   └── Miembros.jsx           # Página principal del módulo
└── services/
    └── api_miembros.js        # Servicios de API para miembros
```

## 📋 Campos de Miembro

| Campo | Tipo | Descripción |
|-------|------|-------------|
| NC | String | Número de Control (identificador único) |
| Nombre | String | Nombre del miembro |
| Apellido Paterno | String | Apellido paterno |
| Apellido Materno | String | Apellido materno |
| Correo | String | Correo electrónico institucional |
| Rol | String | Rol en la organización |
| Cargo | String | Cargo específico |
| Coordinación | String | Departamento o área |

## 🔄 Interacciones

Las interacciones registran la comunicación entre miembros de diferentes departamentos:

- Miembro origen
- Miembro destino
- Mensaje/nota
- Fecha y hora
- Estado (opcional)

## 🛠️ Uso del Módulo

### 1. Listar Miembros

```javascript
import { getMembers } from '../services/api_miembros';

// Listar todos los miembros
const members = await getMembers();

// Buscar miembros
const results = await getMembers({ q: 'texto_busqueda' });
```

### 2. Gestionar Miembro

```javascript
import { createMember, updateMember, deleteMember } from '../services/api_miembros';

// Crear nuevo miembro
const newMember = await createMember({
  numero_control: "NC123",
  nombre: "Juan",
  apellido_paterno: "Pérez",
  correo: "juan@ejemplo.com",
  // ...resto de campos
});

// Actualizar miembro
await updateMember("NC123", { 
  correo: "nuevo@ejemplo.com" 
});

// Eliminar miembro
await deleteMember("NC123");
```

### 3. Gestionar Interacciones

```javascript
import { getInteractions, addInteraction } from '../services/api_miembros';

// Ver interacciones de un miembro
const interactions = await getInteractions("NC123");

// Registrar nueva interacción
await addInteraction("NC123", {
  to: "NC456",
  message: "Solicitud de información"
});
```

## 🔍 Búsqueda y Filtros

La búsqueda de miembros soporta los siguientes campos:
- Número de control (NC)
- Nombre
- Correo
- Rol
- Coordinación

## 📊 Resumen de Datos

El dashboard muestra:
- Total de miembros registrados
- Interacciones registradas hoy
- Distribución por coordinación

## 🛡️ Validaciones

- NC debe ser único
- Correo debe tener formato válido
- No se puede eliminar un miembro con interacciones activas

## 🔗 Integración con Backend

El servicio `api_miembros.js` está preparado para conectarse a estos endpoints:

```
GET    /api/miembros/
POST   /api/miembros/
GET    /api/miembros/{nc}/
PATCH  /api/miembros/{nc}/
DELETE /api/miembros/{nc}/

GET    /api/miembros/{nc}/interacciones/
POST   /api/miembros/{nc}/interacciones/
PATCH  /api/miembros/{nc}/interacciones/{id}/
DELETE /api/miembros/{nc}/interacciones/{id}/

GET    /api/coordinaciones/
```

## 🐛 Solución de Problemas

1. Si un miembro no aparece en la lista:
   - Verificar que el NC sea correcto
   - Comprobar los filtros de búsqueda activos

2. Si una interacción no se registra:
   - Validar que ambos miembros existan
   - Verificar que el mensaje no esté vacío

## 🔜 Próximas Mejoras

- [ ] Exportar listado de miembros a Excel
- [ ] Filtros avanzados por fecha de registro
- [ ] Gráficas de interacciones por departamento
- [ ] Sistema de notificaciones para nuevas interacciones

## 📱 Responsive Design

El módulo está optimizado para:
- 📱 Móviles (< 768px)
- 💻 Tablets (768px - 1024px)
- 🖥️ Desktop (> 1024px)