import React, { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import { useNavigate } from "react-router-dom";
import EditarEstudianteModal from "../components/EditarEstudianteModal.jsx";
import {
  getEstudiantes,
  updateEstudiante,
  deleteEstudiante,
} from "../services/api_becas_estudiante.js";

export default function Estudiantes() {
  const navigate = useNavigate();

  // --- Estados ---
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false); // <--- loader

  // ✅ ESTADOS DE PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1);
  const [count, setCount] = useState(0); // Total de registros
  const [pageSize] = useState(10); // Tamaño de página (debe coincidir con DRF)
  const totalPages = Math.ceil(count / pageSize);

  // Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- Cargar estudiantes (activado por search o currentPage) ---
  useEffect(() => {
    fetchEstudiantes();
  }, [search, currentPage]); // ✅ Dependencias actualizadas

  async function fetchEstudiantes() {
    setLoading(true); // <--- inicio carga
    try {
      // 1. Construir la cadena de consulta (query string)
      const params = new URLSearchParams();
      // Si hay búsqueda, añadir el parámetro 'search'
      if (search) {
        params.append("search", search);
      }
      // Siempre añadir el parámetro de página
      params.append("page", currentPage);

      const query = params.toString(); // "page=1&search=juan"

      // 2. Llamar a la API
      const response = await getEstudiantes(query);

      // 3. Manejar la respuesta de paginación de DRF
      setEstudiantes(response.results); // La lista de estudiantes de la página actual
      setCount(response.count); // El total de resultados filtrados
    } catch (err) {
      console.error("❌ Error al obtener estudiantes:", err);
      // Opcional: mostrar un mensaje de error al usuario
    } finally {
      setLoading(false); // <--- fin carga
    }
  }

  // --- Manejo de la Paginación ---
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // --- Abrir modal ---
  const handleEdit = (student) => {
    setSelectedStudent({ ...student });
    setShowEditModal(true);
  };

  // --- Guardar edición ---
  const handleSaveEdit = async (formData) => {
    try {
      const updated = await updateEstudiante(
        selectedStudent.numero_control,
        formData
      );
      // Solo actualizamos el estudiante en la página actual
      setEstudiantes((prev) =>
        prev.map((s) =>
          s.numero_control === selectedStudent.numero_control ? updated : s
        )
      );
      setShowEditModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("❌ Error al guardar cambios:", err);
      // Opcional: alertar al usuario
    }
  };

  // --- Eliminar ---
  const handleDelete = async (numero_control) => {
    if (!window.confirm("¿Seguro que deseas eliminar a este estudiante?"))
      return;
    try {
      await deleteEstudiante(numero_control);
      // Filtramos el estudiante de la lista actual. Si la página queda vacía, volvemos a la anterior.
      const newStudents = estudiantes.filter(
        (s) => s.numero_control !== numero_control
      );

      if (newStudents.length === 0 && currentPage > 1) {
        // Si eliminamos el último de la página, volvemos a la anterior
        setCurrentPage(currentPage - 1);
      } else {
        // De lo contrario, simplemente recargamos la página actual
        fetchEstudiantes();
      }
    } catch (err) {
      console.error("❌ Error al eliminar estudiante:", err);
      // Opcional: alertar al usuario
    }
  };

  // --- Buscar ---
  const handleSearch = () => {
    // Al buscar, reiniciamos a la página 1 y cambiamos el término de búsqueda
    setCurrentPage(1);
    setSearch(searchInput);
  };

  // --- Render ---
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Estudiantes
        </h1>
        <button
          onClick={() => navigate("/agregar-estudiante")}
          className="mt-4 sm:mt-0 bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer transition duration-150"
          disabled={loading}
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
          Agregar Estudiante
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar estudiante por nombre o número de control..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer transition duration-150 disabled:opacity-50"
          disabled={loading}
        >
          Buscar
        </button>
        {/* Botón para limpiar búsqueda */}
        {search && (
          <button
            onClick={() => { setSearchInput(""); setSearch(""); setCurrentPage(1); }}
            className="text-sm text-gray-600 hover:text-red-600 hover:underline px-4 py-2 hover:cursor-pointer"
          >
            Limpiar búsqueda
          </button>
        )}
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <SummaryCard
          title="Total Estudiantes"
          mainText={loading ? "..." : count}
          subText="Estudiantes totales registrados (filtrados)"
        />
        <SummaryCard
          title="Página Actual"
          mainText={loading ? "..." : `${currentPage} de ${totalPages}`}
          subText={`Mostrando ${loading ? "..." : estudiantes.length} resultados`}
        />
      </div>

      {/* Tabla y Paginación */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
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
            Cargando estudiantes...
          </div>
        ) : estudiantes.length === 0 && count > 0 ? (
            // Caso: No hay resultados en esta página (ej. después de borrar el último)
             <div className="p-10 text-center text-gray-500">
                Página vacía.
            </div>
        ) : estudiantes.length === 0 && count === 0 ? (
            // Caso: Sin resultados que coincidan con la búsqueda
            <div className="p-10 text-center text-gray-500">
                No se encontraron estudiantes. Intenta una nueva búsqueda.
            </div>
        ) : (
          // --- ✅ Tabla con Datos ---
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Número de Control
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Carrera
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Semestre
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Fecha Registro
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {estudiantes.map((student) => (
                  <tr key={student.numero_control} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {student.nombre} {student.apellido}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#036942] font-medium">
                      {student.numero_control}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.carrera}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.semestre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.telefono}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {student.fecha_registro?.split("T")[0] || "-"}
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-800 hover:cursor-pointer transition duration-150"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(student.numero_control)}
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
        {/* Se muestra solo si hay resultados o si se está cargando la primera página */}
        {(totalPages > 1 || count > 0) && (
          <div className="px-4 py-3 bg-gray-50 flex flex-col sm:flex-row justify-between items-center border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2 sm:mb-0">
              Página **{currentPage}** de **{totalPages}** (Total: **{count}** estudiantes)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition duration-150"
              >
                Anterior
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || count === 0 || loading}
                className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 transition duration-150"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {showEditModal && selectedStudent && (
        <EditarEstudianteModal
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveEdit}
          estudianteData={selectedStudent}
        />
      )}
    </div>
  );
}