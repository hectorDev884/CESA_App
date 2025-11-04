import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CalendarioModal from "../components/CalendarioModal.jsx";
import EditarBecasModal from "../components/EditarBecaModal.jsx";
import {
  getBecas,
  updateBeca,
  deleteBeca,
  generarCalendario,
  generarCalendarioGeneral,
} from "../services/api_becas_estudiante.js"; // backend real

export default function Becas() {
  const navigate = useNavigate();

  // --- Estados de Búsqueda y Modales ---
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // Término de búsqueda activo
  const [showModal, setShowModal] = useState(false); // Modal Calendario
  const [showEditModal, setShowEditModal] = useState(false); // Modal Edición
  const [selectedBeca, setSelectedBeca] = useState(null);

  // --- Estados de Carga y Paginación ---
  const [becas, setBecas] = useState([]); // Lista de becas de la página actual
  const [isLoading, setIsLoading] = useState(true); // Indica si los datos están cargando
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0); // Total de elementos (DRF count)
  const [pageSize] = useState(10); // Tamaño de página fijo
  const totalPages = Math.ceil(count / pageSize);

  // Estado para el input de navegación rápida
  const [goToPageInput, setGoToPageInput] = useState("");
  
  // --- Estados de Filtro ---
  const [filtroEstatus, setFiltroEstatus] = useState(null); // Filtro activo: 'aprobada', 'pendiente', o null (Todas)

  // --- 🔄 Cargar becas (activado por search, currentPage o filtroEstatus) ---
  useEffect(() => {
    fetchBecas();
  }, [search, currentPage, filtroEstatus]);

  // Sincronizar el input de navegación rápida con la página actual
  useEffect(() => {
    setGoToPageInput(currentPage.toString());
  }, [currentPage]);

  async function fetchBecas() {
    setIsLoading(true); // 👈 Iniciar carga
    try {
      // 1. Construir la cadena de consulta (query string)
      const params = new URLSearchParams();
      
      // Si hay búsqueda, añadir el parámetro 'search'
      if (search) {
        params.append("search", search);
      }

      // 💡 Cambio: Si hay filtro, añadir el parámetro 'estatus'. Ya no se excluye 'finalizada'.
      if (filtroEstatus) { 
          params.append("search", filtroEstatus); 
      }
      
      // Siempre añadir el parámetro de página
      params.append("page", currentPage);
      
      const query = params.toString();

      // 2. Llamar a la API
      const response = await getBecas(query); // Asumiendo que getBecas(query) retorna {count, results}
      
      // 3. Manejar la respuesta de paginación de DRF
      const dataResults = response.results;
      const totalCount = response.count;

      setBecas(dataResults);
      setCount(totalCount); 
      
      // Si la página actual queda vacía después de buscar, volvemos a la 1
      if(dataResults.length === 0 && currentPage > 1 && totalCount > 0){
          setCurrentPage(1);
      }

    } catch (err) {
      console.error("❌ Error al obtener becas:", err);
    } finally {
      setIsLoading(false); // 👈 Finalizar carga (éxito o error)
    }
  }

  // --- 🔍 Buscar
  const handleSearch = () => {
    // Reiniciar a la página 1 y aplicar el filtro
    setCurrentPage(1);
    setSearch(searchInput);
  };
  
  // --- Manejo del filtro de estatus ---
  const handleFilterChange = (newFilter) => {
    setCurrentPage(1); // Siempre resetear a la página 1 al cambiar el filtro
    setFiltroEstatus(newFilter);
  };

  // --- Manejo de la Paginación ---
  const handlePageChange = (newPage) => {
    // Si la nueva página es válida, actualizamos el estado
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // ✅ FUNCIÓN: Navegación rápida
  const handleGoToPage = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(goToPageInput, 10);

    // Validación: debe ser un número, estar dentro del rango y no ser la página actual
    if (
      !isNaN(pageNumber) &&
      pageNumber >= 1 &&
      pageNumber <= totalPages &&
      pageNumber !== currentPage
    ) {
      setCurrentPage(pageNumber);
    } else {
      // Si la entrada no es válida, reseteamos el input al valor actual
      setGoToPageInput(currentPage.toString());
      console.log(`Página no válida: ingrese un número entre 1 y ${totalPages}.`);
    }
  };


  // --- 🗑️ Eliminar beca
  const handleDelete = async (becaId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta beca?")) return;
    try {
      await deleteBeca(becaId);
      
      // Intentar mantener el comportamiento de eliminación de Estudiantes.jsx
      const newBecas = becas.filter((b) => b.beca_id !== becaId);

      if (newBecas.length === 0 && currentPage > 1) {
        // Si eliminamos el último de la página, volvemos a la anterior
        setCurrentPage(currentPage - 1);
      } else {
        // De lo contrario, simplemente recargamos la página actual para rellenar el espacio (si existe)
        fetchBecas(); 
      }
      
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
      // Actualiza la beca en la lista de la página actual
      setBecas((prev) =>
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
        <div className="flex gap-3 mt-4 sm:mt-0">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer transition duration-150 disabled:opacity-50"
            onClick={() => setShowModal(true)}
            disabled={isLoading}
          >
            Generar Calendario
          </button>
          <button
            className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer transition duration-150 disabled:opacity-50"
            onClick={() => navigate("/agregar-beca")}
            disabled={isLoading}
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

      {/* Barra de búsqueda y Filtros */}
      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar beca por estudiante, tipo o estatus..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer disabled:opacity-50 transition duration-150"
          disabled={isLoading}
        >
          Buscar
        </button>
        
        {/* Dropdown de Filtros */}
        <select
          value={filtroEstatus || ""}
          onChange={(e) => handleFilterChange(e.target.value || null)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          <option value="">Todas las Becas</option>
          <option value="aprobada">Activas</option>
          <option value="pendiente">Pendientes</option>
          {/* ❌ Opción "Finalizadas" Eliminada */}
        </select>

        {/* Botón para limpiar búsqueda */}
        {(search || filtroEstatus) && (
          <button
            onClick={() => { setSearchInput(""); setSearch(""); handleFilterChange(null); }}
            className="text-sm text-gray-600 hover:text-red-600 hover:underline px-4 py-2 hover:cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Contenido principal: Carga, Sin Datos o Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading ? (
          // --- ⏳ Indicador de Carga con estilo ---
          <div className="p-10 text-center text-xl text-gray-600 flex justify-center items-center gap-3">
            <svg
              className="animate-spin h-6 w-6 text-[#036942]"
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
        ) : becas.length === 0 && count > 0 ? (
          // Caso: No hay resultados en esta página (ej. después de borrar el último)
          <div className="p-10 text-center text-gray-500">
            Página vacía.
          </div>
        ) : becas.length === 0 && count === 0 ? (
          // Caso: Sin resultados que coincidan con la búsqueda/filtro
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
                {becas.map((b) => (
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
                        className="text-blue-600 hover:text-blue-800 hover:cursor-pointer transition duration-150"
                        onClick={() => handleEdit(b)}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(b.beca_id)}
                        className="text-red-600 hover:text-red-800 hover:cursor-pointer transition duration-150"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}


        {/* ✅ COMPONENTES DE PAGINACIÓN */}
        {/* Se muestra solo si hay más de una página o si hay resultados para mostrar */}
        {totalPages > 0 && (
          <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
            {/* Texto de información */}
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              Página **{currentPage}** de **{totalPages}** (Total: **{count}** becas)
            </p>

            {/* Controles de navegación */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              {/* ✅ Navegación Rápida */}
              <form onSubmit={handleGoToPage} className="flex items-center gap-1.5">
                <label htmlFor="goToPage" className="text-sm text-gray-700">
                  Ir a:
                </label>
                <input
                  id="goToPage"
                  type="number"
                  min="1"
                  max={totalPages}
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  className="w-12 px-2 py-1 text-sm border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-green-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-sm rounded-lg border border-green-600 text-green-600 bg-white hover:bg-green-50 disabled:opacity-50 transition duration-150"
                  disabled={isLoading || currentPage.toString() === goToPageInput}
                >
                  Ir
                </button>
              </form>

              {/* Botones Anterior/Siguiente */}
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition duration-150"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || isLoading}
                  className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition duration-150"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      {showModal && (
        <CalendarioModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerateCalendar}
          onGenerateAll={generarCalendarioGeneral}
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