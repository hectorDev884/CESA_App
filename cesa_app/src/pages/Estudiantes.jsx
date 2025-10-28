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
  // ❌ allStudents ahora se convierte en la lista de la página actual (results)
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
          params.append('search', search);
      }
      // Siempre añadir el parámetro de página
      params.append('page', currentPage);

      const query = params.toString(); // "page=1&search=juan"

      // 2. Llamar a la API
      const response = await getEstudiantes(query); 
      
      // 3. Manejar la respuesta de paginación de DRF
      setEstudiantes(response.results); // La lista de estudiantes de la página actual
      setCount(response.count); // El total de resultados filtrados
      
    } catch (err) {
      console.error("❌ Error al obtener estudiantes:", err);
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
      const updated = await updateEstudiante(selectedStudent.numero_control, formData);
      // Solo actualizamos el estudiante en la página actual
      setEstudiantes((prev) =>
        prev.map((s) => (s.numero_control === selectedStudent.numero_control ? updated : s))
      );
      setShowEditModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("❌ Error al guardar cambios:", err);
    }
  };

  // --- Eliminar ---
  const handleDelete = async (numero_control) => {
    if (!window.confirm("¿Seguro que deseas eliminar a este estudiante?")) return;
    try {
      await deleteEstudiante(numero_control);
      // Filtramos el estudiante de la lista actual y recargamos la página
      setEstudiantes((prev) => prev.filter((s) => s.numero_control !== numero_control));
      // Importante: forzar la recarga para rellenar el hueco o ajustar la paginación
      fetchEstudiantes(); 
    } catch (err) {
      console.error("❌ Error al eliminar estudiante:", err);
    }
  };

  // --- Buscar ---
  const handleSearch = () => {
    // Al buscar, reiniciamos a la página 1 y cambiamos el término de búsqueda
    setCurrentPage(1); 
    setSearch(searchInput);
  };

  // ❌ Se elimina el useEffect anterior para filtrar estudiantes en el cliente

  // --- Render ---
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Cargando estudiantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
        <button
          onClick={() => navigate("/agregar-estudiante")}
          className="mt-4 sm:mt-0 bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer"
        >
          Buscar
        </button>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ✅ Usamos 'count' para el total de estudiantes (ya filtrados) */}
        <SummaryCard title="Total Estudiantes" mainText={count} subText="Estudiantes totales registrados (filtrados)" />
        <SummaryCard
          title="Página Actual"
          mainText={`${currentPage} de ${totalPages}`}
          subText={`Mostrando ${estudiantes.length} resultados`} />
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Número de Control</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Carrera</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Semestre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Registro</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {/* ✅ Iteramos sobre 'estudiantes' (los de la página actual) */}
            {estudiantes.map((student) => ( 
              <tr key={student.numero_control} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{student.nombre} {student.apellido}</td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">{student.numero_control}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.carrera}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.semestre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.telefono}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.fecha_registro?.split("T")[0] || "-"}</td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800 hover:cursor-pointer">✏️</button>
                  <button onClick={() => handleDelete(student.numero_control)} className="text-red-600 hover:text-red-800 hover:cursor-pointer">❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* ✅ COMPONENTES DE PAGINACIÓN */}
        <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-600">
                Página **{currentPage}** de **{totalPages}** (Total: **{count}** estudiantes)
            </p>
            <div className="flex gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Anterior
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || count === 0}
                    className="px-3 py-1 text-sm rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
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