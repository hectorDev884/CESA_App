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

  // --- Estados para búsqueda y listado ---
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [allStudents, setAllStudents] = useState([]); // Lista completa
  const [displayedStudents, setDisplayedStudents] = useState([]); // Lista filtrada

  // --- Estados para modal ---
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- 🔄 Cargar estudiantes ---
  useEffect(() => {
    fetchEstudiantes();
  }, [search]);

  async function fetchEstudiantes() {
    try {
      const query = search ? `search=${encodeURIComponent(search)}` : "";
      const data = await getEstudiantes(query);
      setAllStudents(data);
    } catch (err) {
      console.error("❌ Error al obtener estudiantes:", err);
    }
  }

  // --- ✏️ Abrir modal de edición ---
  const handleEdit = (student) => {
    setSelectedStudent({ ...student });
    setShowEditModal(true);
  };

  // --- 💾 Guardar cambios ---
  const handleSaveEdit = async (formData) => {
    try {
      const updated = await updateEstudiante(selectedStudent.numero_control, formData);
      setAllStudents((prev) =>
        prev.map((s) =>
          s.numero_control === selectedStudent.numero_control ? updated : s
        )
      );
      setShowEditModal(false);
      setSelectedStudent(null);
    } catch (err) {
      console.error("❌ Error al guardar cambios:", err);
    }
  };

  // --- 🗑️ Eliminar estudiante ---
  const handleDelete = async (numero_control) => {
    if (!window.confirm("¿Seguro que deseas eliminar a este estudiante?")) return;
    try {
      await deleteEstudiante(numero_control);
      setAllStudents((prev) =>
        prev.filter((s) => s.numero_control !== numero_control)
      );
    } catch (err) {
      console.error("❌ Error al eliminar estudiante:", err);
    }
  };

  // --- 🔍 Búsqueda ---
  const handleSearch = () => {
    setSearch(searchInput);
  };

  // --- ✨ Filtrar estudiantes según búsqueda ---
  useEffect(() => {
    setDisplayedStudents(
      allStudents.filter(
        (s) =>
          `${s.nombre} ${s.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
          s.numero_control.toString().includes(search)
      )
    );
  }, [allStudents, search]);

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
        <SummaryCard title="Total Estudiantes" mainText={allStudents.length} subText="Estudiantes totales registrados" />
        <SummaryCard
          title="Nuevos Ingresos"
          mainText={allStudents.filter(e => new Date(e.fecha_registro).getMonth() === new Date().getMonth()).length}
          subText={`Registrados en ${new Date().toLocaleString("es-MX", { month: "long" })}`} />
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
            {displayedStudents.map((student) => (
              <tr key={student.numero_control} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{student.nombre} {student.apellido}</td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">{student.numero_control}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.carrera}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.semestre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.telefono}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.fecha_registro?.split("T")[0] || "-"}</td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(student)}
                    className="text-blue-600 hover:text-blue-800 hover:cursor-pointer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(student.numero_control)}
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
          Mostrando {displayedStudents.length} de {allStudents.length} estudiantes
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
