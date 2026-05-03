import React, { useState } from "react";

const sections = [
  {
    id: "inicio",
    icon: "🏠",
    title: "Inicio de Sesión",
    content: [
      {
        subtitle: "¿Cómo iniciar sesión?",
        steps: [
          "Abre la aplicación en tu navegador. Si no estás logueado, serás redirigido automáticamente a la pantalla de inicio de sesión.",
          "Ingresa tu correo electrónico en el campo 'Correo'.",
          "Ingresa tu contraseña en el campo 'Contraseña'.",
          "Haz clic en el botón 'Iniciar sesión'.",
          "Si los datos son correctos, serás redirigido al panel principal (Dashboard).",
        ],
      },
      {
        subtitle: "¿Cómo cerrar sesión?",
        steps: [
          "En la barra de navegación superior, haz clic en el botón rojo 'Cerrar sesión'.",
          "Tu sesión se cerrará de forma segura y serás redirigido a la pantalla de inicio de sesión.",
          "Nota: La sesión expira automáticamente después de 1 hora de inactividad.",
        ],
      },
    ],
  },
  {
    id: "estudiantes",
    icon: "🎓",
    title: "Estudiantes",
    content: [
      {
        subtitle: "Ver la lista de estudiantes",
        steps: [
          "En el menú superior, haz clic en 'Estudiantes'.",
          "Verás una tabla con todos los estudiantes registrados, mostrando 10 por página.",
          "Usa los botones 'Anterior' y 'Siguiente' para navegar entre páginas.",
        ],
      },
      {
        subtitle: "Buscar un estudiante",
        steps: [
          "En la barra de búsqueda (parte superior de la tabla), escribe el nombre o número de control del estudiante.",
          "La tabla se filtra automáticamente mientras escribes.",
          "Para limpiar la búsqueda, borra el texto del campo.",
        ],
      },
      {
        subtitle: "Agregar un estudiante",
        steps: [
          "Haz clic en el botón 'Agregar Estudiante'.",
          "Rellena el formulario con: Nombre, Apellido, Número de Control, Carrera, Semestre y Teléfono.",
          "Haz clic en 'Guardar' para registrar al estudiante.",
          "Aparecerá un mensaje de confirmación si se guardó correctamente.",
        ],
      },
      {
        subtitle: "Editar un estudiante",
        steps: [
          "En la tabla, localiza al estudiante que deseas editar.",
          "Haz clic en el ícono de lápiz (editar) en la columna de acciones.",
          "Se abrirá un modal con los datos actuales del estudiante.",
          "Modifica los campos necesarios y haz clic en 'Guardar cambios'.",
        ],
      },
      {
        subtitle: "Eliminar un estudiante",
        steps: [
          "En la tabla, haz clic en el ícono de basura (eliminar) del estudiante.",
          "Aparecerá una ventana de confirmación preguntando si estás seguro.",
          "Haz clic en 'Confirmar' para eliminar permanentemente o 'Cancelar' para no hacer nada.",
        ],
      },
      {
        subtitle: "Importar estudiantes desde Excel",
        steps: [
          "Haz clic en el botón 'Importar Excel'.",
          "Selecciona un archivo .xlsx con los datos de los estudiantes.",
          "El archivo debe tener columnas: numero_control, nombre, apellido, carrera, semestre, telefono.",
          "El sistema procesará el archivo, mostrará cuántos registros se importaron y avisará si hubo errores por fila.",
        ],
      },
    ],
  },
  {
    id: "becas",
    icon: "📋",
    title: "Becas",
    content: [
      {
        subtitle: "Ver la lista de becas",
        steps: [
          "Haz clic en 'Becas' en el menú superior.",
          "Verás la tabla de becas con columnas: N. Control, Estudiante, Tipo, Fecha Solicitud, Fecha Entrega y Estatus.",
          "Por defecto se muestran todas las becas. Puedes filtrar por estatus usando los botones: 'Todas', 'Aprobadas' y 'Pendientes'.",
        ],
      },
      {
        subtitle: "Buscar una beca",
        steps: [
          "Usa la barra de búsqueda para encontrar becas por nombre del estudiante, tipo de beca o estatus.",
          "La búsqueda es instantánea conforme escribes.",
        ],
      },
      {
        subtitle: "Registrar una nueva beca",
        steps: [
          "Haz clic en 'Registrar Beca'.",
          "Rellena el formulario: Número de Control del estudiante, Tipo de Beca, Fecha de Solicitud, Fecha de Entrega y Estatus.",
          "Haz clic en 'Guardar' para registrar la beca.",
        ],
      },
      {
        subtitle: "Editar una beca",
        steps: [
          "Haz clic en el ícono de lápiz de la beca que deseas modificar.",
          "Actualiza los campos necesarios (tipo, estatus, fechas, etc.).",
          "Guarda los cambios.",
        ],
      },
      {
        subtitle: "Generar calendario de becas",
        steps: [
          "Haz clic en el botón 'Generar Calendario'.",
          "Configura las fechas de entrega en el modal que aparece.",
          "El sistema generará un calendario con las fechas programadas de entrega de becas.",
        ],
      },
    ],
  },
  {
    id: "eventos",
    icon: "📅",
    title: "Eventos",
    content: [
      {
        subtitle: "Ver eventos del semestre",
        steps: [
          "Haz clic en 'Eventos' en el menú superior.",
          "El sistema muestra los eventos del semestre actual: Semestre A (Enero–Junio) o Semestre B (Julio–Diciembre).",
          "Puedes cambiar el semestre mostrado usando los botones de filtro 'Semestre A' / 'Semestre B'.",
        ],
      },
      {
        subtitle: "Buscar un evento",
        steps: [
          "Escribe en la barra de búsqueda el nombre o tipo del evento.",
          "La tabla se actualiza en tiempo real.",
        ],
      },
      {
        subtitle: "Agregar un evento",
        steps: [
          "Haz clic en 'Agregar Evento'.",
          "Completa el formulario: Nombre, Tipo, Fecha, Hora, Ubicación, Estatus y Semestre.",
          "Haz clic en 'Guardar'.",
        ],
      },
      {
        subtitle: "Editar o eliminar un evento",
        steps: [
          "Para editar: haz clic en el ícono de lápiz de la fila del evento.",
          "Para eliminar: haz clic en el ícono de basura y confirma en el diálogo.",
        ],
      },
    ],
  },
  {
    id: "miembros",
    icon: "👥",
    title: "Miembros e Interacciones",
    content: [
      {
        subtitle: "Gestión de miembros CESA",
        steps: [
          "Haz clic en 'Miembros' en el menú superior.",
          "Verás dos pestañas: 'Miembros' e 'Interacciones'.",
          "En 'Miembros' puedes ver, agregar, editar y eliminar miembros del comité.",
          "Usa la barra de búsqueda para encontrar miembros por número de control.",
          "Al eliminar un miembro, también se eliminan todas sus interacciones registradas.",
        ],
      },
      {
        subtitle: "Registrar una interacción",
        steps: [
          "Cambia a la pestaña 'Interacciones'.",
          "Haz clic en 'Agregar Interacción'.",
          "Selecciona el miembro, el tipo de interacción, el tema, la fecha y escribe una descripción.",
          "Guarda el registro.",
        ],
      },
      {
        subtitle: "Ver historial de interacciones",
        steps: [
          "En la pestaña 'Interacciones', verás el listado de todas las interacciones registradas.",
          "Puedes editar o eliminar cada interacción usando los íconos de acción.",
        ],
      },
    ],
  },
  {
    id: "reportes",
    icon: "📈",
    title: "Reportes",
    content: [
      {
        subtitle: "Ver reportes de becas",
        steps: [
          "Haz clic en 'Reportes' en el menú superior.",
          "Verás tarjetas de resumen con: Total de becas, Becas aprobadas y Becas pendientes.",
          "Debajo hay cuatro gráficas interactivas: por carrera, por semestre, por tipo y por estatus.",
          "Pasa el cursor sobre las gráficas para ver los valores exactos en los tooltips.",
        ],
      },
      {
        subtitle: "Exportar reporte a Excel",
        steps: [
          "En la página de Reportes, haz clic en el botón 'Exportar a Excel'.",
          "Se descargará automáticamente un archivo .xlsx con los datos del reporte.",
        ],
      },
    ],
  },
  {
    id: "financiero",
    icon: "💰",
    title: "Financiero (solo Administrador)",
    content: [
      {
        subtitle: "Ver registros financieros",
        steps: [
          "Esta sección solo es visible para usuarios con rol de Administrador.",
          "Haz clic en 'Financiero' en el menú superior.",
          "Verás una tabla con ingresos y egresos, más un resumen de balance en la parte superior.",
        ],
      },
      {
        subtitle: "Agregar un ingreso o egreso",
        steps: [
          "Haz clic en 'Agregar Registro'.",
          "Selecciona el Tipo: 'Ingreso' o 'Egreso'.",
          "Completa: Monto, Concepto, Categoría y Fecha.",
          "Guarda el registro. El balance se actualiza automáticamente.",
        ],
      },
      {
        subtitle: "Editar o eliminar un registro",
        steps: [
          "Para editar: haz clic en el ícono de lápiz del registro.",
          "Para eliminar: haz clic en el ícono de basura y confirma.",
        ],
      },
      {
        subtitle: "Buscar y filtrar registros",
        steps: [
          "Usa la barra de búsqueda para filtrar por concepto o categoría.",
          "También puedes filtrar por tipo (Ingreso/Egreso) usando los botones de filtro.",
        ],
      },
    ],
  },
  {
    id: "backup",
    icon: "💾",
    title: "Backup (solo Administrador)",
    content: [
      {
        subtitle: "Crear un respaldo de la base de datos",
        steps: [
          "Esta función solo está disponible para Administradores.",
          "En el menú superior, haz clic en 'Backup'.",
          "Escribe un nombre descriptivo para identificar el respaldo (por ejemplo: 'Respaldo Mayo 2026').",
          "Haz clic en el botón para iniciar el proceso de backup.",
          "Espera a que el sistema termine. Verás una barra de carga mientras procesa.",
          "Cuando termine, recibirás una notificación de éxito.",
        ],
      },
    ],
  },
  {
    id: "roles",
    icon: "🔐",
    title: "Roles y Permisos",
    content: [
      {
        subtitle: "Tipos de usuario",
        steps: [
          "Usuario regular: Tiene acceso a Eventos, Miembros, Becas, Estudiantes, Oficios y Reportes.",
          "Administrador: Tiene acceso a todo lo anterior más Financiero y Backup.",
          "Si intentas acceder a una sección para la que no tienes permiso, serás redirigido automáticamente.",
        ],
      },
      {
        subtitle: "Duración de la sesión",
        steps: [
          "La sesión dura 1 hora desde el momento de iniciar sesión.",
          "Si la sesión expira, serás redirigido a la pantalla de inicio de sesión.",
          "Vuelve a ingresar tus credenciales para continuar usando el sistema.",
        ],
      },
    ],
  },
];

const AccordionItem = ({ section, isOpen, onToggle }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <span className="font-semibold text-gray-800 text-base">{section.title}</span>
        </div>
        <span className="text-gray-500 text-lg font-light">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 bg-gray-50 border-t border-gray-100">
          {section.content.map((block, i) => (
            <div key={i} className="mt-4">
              <h4 className="font-semibold text-[#036942] mb-2">{block.subtitle}</h4>
              <ol className="space-y-2">
                {block.steps.map((step, j) => (
                  <li key={j} className="flex gap-3 text-sm text-gray-700 leading-relaxed">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#036942] text-white text-xs flex items-center justify-center font-semibold">
                      {j + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Ayudas = () => {
  const [openSection, setOpenSection] = useState("inicio");
  const [search, setSearch] = useState("");

  const filtered = sections.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.content.some(
        (b) =>
          b.subtitle.toLowerCase().includes(search.toLowerCase()) ||
          b.steps.some((step) => step.toLowerCase().includes(search.toLowerCase()))
      )
  );

  const toggle = (id) => setOpenSection(openSection === id ? null : id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-[#036942] rounded-2xl p-6 mb-6 text-white shadow-md">
        <h1 className="text-2xl font-bold mb-1">Manual de Usuario</h1>
        <p className="text-green-100 text-sm">
          Consulta aquí cómo usar cada sección del sistema C.E.S.A.
        </p>
      </div>

      {/* Buscador */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Buscar en el manual..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#036942]"
        />
      </div>

      {/* Secciones */}
      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No se encontraron resultados para tu búsqueda.</p>
      ) : (
        filtered.map((section) => (
          <AccordionItem
            key={section.id}
            section={section}
            isOpen={openSection === section.id}
            onToggle={() => toggle(section.id)}
          />
        ))
      )}

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-8">
        Sistema C.E.S.A — Manual de Usuario v1.0
      </p>
    </div>
  );
};

export default Ayudas;
