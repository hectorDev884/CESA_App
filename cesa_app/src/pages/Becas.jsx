import React, { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import { useNavigate } from "react-router-dom";
import CalendarioModal from "../components/CalendarioModal.jsx";
import EditarBecasModal from "../components/EditarBecaModal.jsx";
import {
  getBecas,
  updateBeca,
  deleteBeca,
  generarCalendario,
} from "../services/api_becas_estudiante.js"; // backend real

export default function Becas() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBeca, setSelectedBeca] = useState(null);

  // --- 🆕 Estado de carga ---
  const [isLoading, setIsLoading] = useState(true); // Indica si los datos están cargando
  
  // --- Estados de datos ---
  const [allBecas, setAllBecas] = useState([]); // Lista maestra
  const [displayedBecas, setDisplayedBecas] = useState([]); // Lista para mostrar
  const [filtroEstatus, setFiltroEstatus] = useState(null); // Filtro activo

  const navigate = useNavigate();

  // --- 🔄 Traer becas del backend
  useEffect(() => {
    fetchBecas();
  }, [search]); // recarga cada vez que cambie la búsqueda

  async function fetchBecas() {
    setIsLoading(true); // 👈 Iniciar carga
    try {
      const query = search ? `search=${encodeURIComponent(search)}` : "";
      const data = await getBecas(query);
      setAllBecas(data); // Actualiza la lista maestra
    } catch (err) {
      console.error("❌ Error al obtener becas:", err);
    } finally {
      setIsLoading(false); // 👈 Finalizar carga (éxito o error)
    }
  }

  // --- ✨ Efecto para aplicar filtros ---
  useEffect(() => {
    let filtered = [...allBecas];

    if (filtroEstatus === "aprobada") {
      filtered = allBecas.filter((b) => b.estatus === "aprobada");
    } else if (filtroEstatus === "pendiente") {
      filtered = allBecas.filter((b) => b.estatus === "pendiente");
    } else if (filtroEstatus === "finalizada") {
      filtered = allBecas.filter((b) => new Date(b.fecha_fin) < new Date());
    }
    // Si filtroEstatus es null, 'filtered' se queda como la lista completa

    setDisplayedBecas(filtered);
  }, [filtroEstatus, allBecas]); // Se ejecuta si el filtro o la lista maestra cambian

  // --- 🔍 Buscar
  const handleSearch = () => {
    setSearch(searchInput);
  };

  // --- 🗑️ Eliminar beca
  const handleDelete = async (becaId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta beca?")) return;
    try {
      await deleteBeca(becaId);
      // Actualiza la lista maestra
      setAllBecas((prev) => prev.filter((b) => b.beca_id !== becaId));
    } catch (err) {
      console.error("❌ Error al eliminar beca:", err);
    }
  };

  const handleGenerateCalendar = async (data) => {
    try {
      await generarCalendario(data);
      setShowModal(false);
    } catch (err) {
      console.error("❌ Error generando calendario:", err);
      alert("Error al generar el calendario.");
    }
  };

  // --- ✏️ Abrir modal de edición
  const handleEdit = (beca) => {
    setSelectedBeca({ ...beca });
    setShowEditModal(true);
  };

  // --- 💾 Guardar cambios
  const handleSaveEdit = async (formData) => {
    try {
      const updated = await updateBeca(selectedBeca.beca_id, formData);
      // Actualiza la lista maestra
      setAllBecas((prev) =>
        prev.map((b) => (b.beca_id === selectedBeca.beca_id ? updated : b))
      );
      setShowEditModal(false);
      setSelectedBeca(null);
    } catch (err) {
      console.error("❌ Error al guardar cambios:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Becas</h1>
        <div className="flex gap-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            Generar Calendario
          </button>
          <button
            className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer"
            onClick={() => navigate("/agregar-beca")}
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Agregar Beca
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar beca por estudiante, tipo o estatus..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={isLoading} // Desactivar si está cargando
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer disabled:opacity-50"
          disabled={isLoading} // Desactivar si está cargando
        >
          Buscar
        </button>

        {/* Botón para limpiar filtro */}
        {filtroEstatus && (
          <button
            onClick={() => setFiltroEstatus(null)}
            className="text-sm text-gray-600 hover:text-red-600 hover:underline px-4 py-2 hover:cursor-pointer"
          >
            Limpiar filtro (Ver todas)
          </button>
        )}
      </div>

      {/* Cards resumen */}
      {/* Opcionalmente puedes mostrar un placeholder de carga aquí también */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Becas Activas"
          // Muestra un guion si está cargando
          mainText={isLoading ? "..." : allBecas.filter((beca) => beca.estatus == "aprobada").length}
          subText="En curso actualmente"
          buttonText="Ver Activas"
          onButtonClick={() => setFiltroEstatus("aprobada")}
        />
        <SummaryCard
          title="Pendientes de Revisión"
          mainText={isLoading ? "..." : allBecas.filter((beca) => beca.estatus == "pendiente").length.toString()}
          subText="En espera de aprobación"
          buttonText="Ver Pendientes"
          onButtonClick={() => setFiltroEstatus("pendiente")}
        />
        <SummaryCard
          title="Becas Finalizadas"
          mainText={
            isLoading ? "..." : allBecas.filter((beca) => new Date(beca.fecha_fin) < new Date()).length.toString()
          }
          subText="Concluidas este año"
          buttonText="Ver Finalizadas"
          onButtonClick={() => setFiltroEstatus("finalizada")}
        />
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
            Cargando becas...
          </div>
        ) : displayedBecas.length === 0 ? (
          // --- 🚫 Sin Resultados ---
          <div className="p-10 text-center text-gray-500">
            No se encontraron becas que coincidan con los criterios de búsqueda o filtro.
          </div>
        ) : (
          // --- ✅ Tabla con Datos ---
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Número Control
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre del Estudiante
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Tipo de Beca
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Fecha Solicitud
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Fecha Entrega
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Estatus
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayedBecas.map((b) => (
                  <tr key={b.beca_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {b.numero_control}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {b.estudiante ? `${b.estudiante.nombre} ${b.estudiante.apellido}` : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#036942] font-medium">
                      {b.tipo_beca}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.fecha_solicitud}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {b.fecha_entrega}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          b.estatus === "aprobada"
                            ? "bg-green-100 text-green-700"
                            : b.estatus === "pendiente"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {b.estatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                        onClick={() => handleEdit(b)}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(b.beca_id)}
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
              Mostrando {displayedBecas.length} becas
            </div>
          </>
        )}
      </div>

      {/* Modales */}
      {showModal && (
        <CalendarioModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerateCalendar}
        />
      )}
      {showEditModal && selectedBeca && (
        <EditarBecasModal
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          becaData={selectedBeca}
        />
      )}
    </div>
  );
}