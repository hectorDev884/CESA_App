import React, { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import MiembrosModal from "./MiembrosModal.jsx"; // Modal para Agregar/Editar
import InteraccionModal from "../components/InteraccionModal.jsx"; // Asume que existe para la nueva interacción

// --- 🛠️ Funciones Mock de la API (DEBEN SER REEMPLAZADAS POR TU BACKEND REAL) ---
const mockMiembros = [
  {
    miembro_id: 1,
    nc: "E19010001",
    nombre: "Ana",
    apellido_paterno: "García",
    apellido_materno: "López",
    correo: "ana.garcia@comite.mx",
    cargo: "Presidente",
    rol: "Administrativo",
    coordinacion: "General",
    activo: true,
  },
  {
    miembro_id: 2,
    nc: "E18020002",
    nombre: "Juan",
    apellido_paterno: "Pérez",
    apellido_materno: "Méndez",
    correo: "juan.perez@comite.mx",
    cargo: "Secretario",
    rol: "Operativo",
    coordinacion: "Becas",
    activo: true,
  },
  {
    miembro_id: 3,
    nc: "P17030003",
    nombre: "María",
    apellido_paterno: "Sánchez",
    apellido_materno: "Díaz",
    correo: "maria.sanchez@comite.mx",
    cargo: "Vocal",
    rol: "Académico",
    coordinacion: "Eventos",
    activo: false,
  },
];

const mockInteracciones = [
  { id: 1, tipo: "Reunión ordinaria", fecha: "2025-10-20", tema: "Revisión de becas" },
  { id: 2, tipo: "Acuerdo", fecha: "2025-10-15", tema: "Nuevo formato de solicitud" },
];

async function getMiembros(query) {
  // Simulación de una llamada a API con retardo
  await new Promise((resolve) => setTimeout(resolve, 500));
  const search = query.split("=")[1] ? decodeURIComponent(query.split("=")[1]).toLowerCase() : "";
  if (search) {
    return mockMiembros.filter(m => 
        m.nombre.toLowerCase().includes(search) ||
        m.apellido_paterno.toLowerCase().includes(search) ||
        m.cargo.toLowerCase().includes(search)
    );
  }
  return mockMiembros;
}

async function updateMiembro(id, data) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const index = mockMiembros.findIndex(m => m.miembro_id === id);
  if (index !== -1) {
    mockMiembros[index] = { ...mockMiembros[index], ...data };
    return mockMiembros[index];
  }
  return null;
}

async function createMiembro(data) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newMiembro = { ...data, miembro_id: Date.now(), activo: true };
    mockMiembros.push(newMiembro);
    return newMiembro;
}

async function deleteMiembro(id) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const initialLength = mockMiembros.length;
  const index = mockMiembros.findIndex(m => m.miembro_id === id);
  if (index !== -1) {
    mockMiembros.splice(index, 1);
  }
  return initialLength !== mockMiembros.length;
}
// --- ⬆️ Funciones Mock ---


export default function Miembros() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showMiembrosModal, setShowMiembrosModal] = useState(false);
  const [showInteraccionModal, setShowInteraccionModal] = useState(false);
  const [selectedMiembro, setSelectedMiembro] = useState(null); // Miembro para editar o null para agregar

  const [isLoading, setIsLoading] = useState(true);
  const [allMiembros, setAllMiembros] = useState([]);
  const [displayedMiembros, setDisplayedMiembros] = useState([]);
  const [interacciones, setInteracciones] = useState(mockInteracciones); // Solo para el card de resumen
  
  // Nuevo estado para la vista de la tabla
  const [vistaTabla, setVistaTabla] = useState("miembros"); // 'miembros' o 'interacciones'


  // --- 🔄 Traer miembros del backend
  useEffect(() => {
    fetchMiembros();
  }, [search]); // recarga cada vez que cambie la búsqueda

  async function fetchMiembros() {
    setIsLoading(true);
    try {
      const query = search ? `search=${encodeURIComponent(search)}` : "";
      const data = await getMiembros(query);
      setAllMiembros(data);
    } catch (err) {
      console.error("❌ Error al obtener miembros:", err);
    } finally {
      setIsLoading(false);
    }
  }

  // --- ✨ Efecto para aplicar el filtro de "Mostrar Todos" después de una acción
  useEffect(() => {
    // Si la vista es 'miembros', simplemente muestra la lista maestra (que ya está filtrada por búsqueda)
    setDisplayedMiembros(allMiembros);
  }, [allMiembros]);


  // --- 🔍 Buscar
  const handleSearch = () => {
    setSearch(searchInput);
  };

  // --- 🗑️ Eliminar miembro
  const handleDelete = async (miembroId) => {
    if (!window.confirm("¿Seguro que deseas eliminar a este miembro del comité?")) return;
    try {
      await deleteMiembro(miembroId);
      // Actualiza la lista maestra
      setAllMiembros((prev) => prev.filter((m) => m.miembro_id !== miembroId));
      alert("Miembro eliminado con éxito (Mock).");
    } catch (err) {
      console.error("❌ Error al eliminar miembro:", err);
    }
  };

  // --- ✏️/➕ Abrir modal de Agregar/Edición
  const handleOpenModal = (miembro = null) => {
    setSelectedMiembro(miembro); // null para agregar, objeto para editar
    setShowMiembrosModal(true);
  };

  // --- 💾 Guardar cambios (Agregar o Editar)
  const handleSaveMiembro = async (formData) => {
    try {
        if (formData.miembro_id) {
            // Editar
            const updated = await updateMiembro(formData.miembro_id, formData);
            // Actualiza la lista maestra
            setAllMiembros((prev) =>
                prev.map((m) => (m.miembro_id === updated.miembro_id ? updated : m))
            );
            alert("Miembro actualizado con éxito (Mock).");
        } else {
            // Agregar
            const newMiembro = await createMiembro(formData);
            setAllMiembros((prev) => [...prev, newMiembro]);
            alert("Miembro agregado con éxito (Mock).");
        }
      setShowMiembrosModal(false);
      setSelectedMiembro(null);
    } catch (err) {
      console.error("❌ Error al guardar miembro:", err);
    }
  };
  
  // --- 📝 Manejar la nueva interacción (solo mock para el ejemplo)
  const handleSaveInteraccion = (data) => {
    console.log("Guardando nueva interacción:", data);
    // Lógica para guardar la interacción en el backend (simulada)
    setInteracciones((prev) => [...prev, { ...data, id: Date.now() }]);
    setShowInteraccionModal(false);
    alert("Interacción registrada con éxito (Mock).");
  };


  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Centralizado */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
            Gestión de Miembros del Comité 🧑‍🤝‍🧑
        </h1>
      </div>

      {/* Bloque de Paneles (Miembros e Interacciones) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Panel de Miembros */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-green-600">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Miembros</h2>
            <div className="flex flex-wrap gap-4">
                <button
                    className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                    onClick={() => handleOpenModal()} // Abre modal de Agregar
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                    </svg>
                    Agregar Nuevo Miembro
                </button>
                <button
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        vistaTabla === 'miembros' 
                        ? 'bg-green-100 text-green-700 border border-green-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setVistaTabla("miembros")}
                >
                    Mostrar Todos los Miembros ({allMiembros.length})
                </button>
            </div>
        </div>

        {/* Panel de Interacciones */}
        <div className="bg-white shadow rounded-lg p-6 border-t-4 border-blue-600">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Interacciones</h2>
            <div className="flex flex-wrap gap-4">
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                    onClick={() => setShowInteraccionModal(true)}
                >
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-3-3v6m-6 3h12a2 2 0 002-2V7a2 2 0 00-2-2H9.5M9 20V4"
                        />
                    </svg>
                    Nueva Interacción
                </button>
                <button
                     className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        vistaTabla === 'interacciones' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => setVistaTabla("interacciones")}
                >
                    Interacciones Totales ({interacciones.length})
                </button>
            </div>
        </div>
      </div>
      
      {/* Cards resumen (solo para miembros, se mantiene el diseño) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Miembros Activos"
          mainText={isLoading ? "..." : allMiembros.filter((m) => m.activo).length.toString()}
          subText="Miembros con estatus Activo"
          buttonText="Ver Activos"
          // Aquí podrías implementar un filtro de estado, pero lo dejo simple por ahora
          onButtonClick={() => { /* Lógica de filtro activo */ }}
        />
        <SummaryCard
          title="Total de Cargos"
          mainText={isLoading ? "..." : new Set(allMiembros.map(m => m.cargo)).size.toString()}
          subText="Cargos únicos registrados"
          buttonText="Ver Cargos"
          onButtonClick={() => { /* Lógica de filtro de cargos */ }}
        />
        <SummaryCard
          title="Interacciones (Total)"
          mainText={interacciones.length.toString()}
          subText="Sesiones y Acuerdos registrados"
          buttonText="Ver Interacciones"
          onButtonClick={() => setVistaTabla("interacciones")}
        />
      </div>

      {/* Barra de búsqueda (manteniendo funcionalidad) */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar miembro por nombre, apellido o cargo..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer disabled:opacity-50"
          disabled={isLoading}
        >
          Buscar
        </button>
        {/* Botón para limpiar búsqueda */}
        {search && (
          <button
            onClick={() => { setSearchInput(""); setSearch(""); }}
            className="text-sm text-gray-600 hover:text-red-600 hover:underline px-4 py-2 hover:cursor-pointer"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Contenido principal: Carga, Sin Datos o Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          // --- ⏳ Indicador de Carga ---
          <div className="p-10 text-center text-xl text-gray-600 flex justify-center items-center gap-3">
            <svg
              className="animate-spin h-5 w-5 text-[#036942]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Cargando {vistaTabla}...
          </div>
        ) : vistaTabla === "miembros" ? (
            displayedMiembros.length === 0 ? (
                // --- 🚫 Sin Resultados (Miembros) ---
                <div className="p-10 text-center text-gray-500">
                    No se encontraron miembros que coincidan con la búsqueda.
                </div>
            ) : (
                // --- ✅ Tabla de Miembros ---
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">NC</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre Completo</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cargo</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Coordinación</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {displayedMiembros.map((m) => (
                                <tr key={m.miembro_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{m.nc}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">
                                        {m.nombre} {m.apellido_paterno} {m.apellido_materno}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{m.correo}</td>
                                    <td className="px-4 py-3 text-sm text-[#036942] font-medium">{m.cargo}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{m.rol}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{m.coordinacion}</td>
                                    <td className="px-4 py-3 flex justify-center gap-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                                            onClick={() => handleOpenModal(m)} // Abre modal de Edición
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(m.miembro_id)}
                                            className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
                        Mostrando {displayedMiembros.length} miembros
                    </div>
                </>
            )
        ) : (
            // --- ✅ Tabla de Interacciones ---
            interacciones.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                    No se encontraron interacciones registradas.
                </div>
            ) : (
                <>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tema/Descripción</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {interacciones.map((i) => (
                                <tr key={i.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm text-blue-600 font-medium">{i.tipo}</td>
                                    <td className="px-4 py-3 text-sm text-gray-700">{i.fecha}</td>
                                    <td className="px-4 py-3 text-sm text-gray-900">{i.tema}</td>
                                    <td className="px-4 py-3 flex justify-center gap-3">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                                            // Lógica para editar interacción
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            // Lógica para eliminar interacción
                                            className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
                        Mostrando {interacciones.length} interacciones
                    </div>
                </>
            )
        )}
      </div>

      {/* Modales */}
      {showMiembrosModal && (
        <MiembrosModal
          onClose={() => setShowMiembrosModal(false)}
          onSave={handleSaveMiembro}
          miembroData={selectedMiembro} // Pasa el miembro si es edición, o null si es agregar
        />
      )}
      
      {/* Modal de Interacciones (Mock) */}
      {showInteraccionModal && (
        <InteraccionModal // Necesitas crear este componente con la estructura de un Modal (como MiembrosModal)
            onClose={() => setShowInteraccionModal(false)}
            onSave={handleSaveInteraccion}
            // Aquí irían los campos de Interacción
        />
      )}
    </div>
  );
}

// ⚠️ Nota: Para que el archivo Miembros.jsx funcione, debes crear un componente InteraccionModal.jsx 
// o reemplazar el uso de InteraccionModal por un modal dummy o MiembrosModal.