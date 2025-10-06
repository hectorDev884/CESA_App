import React, { useState } from "react";
import SummaryCard from "../components/SummaryCard.jsx";

export default function Estudiantes() {
  const [students, setStudents] = useState([
    {
      numeroControl: "22290696",
      nombre: "Héctor Manuel",
      apellido: "Torres Cuevas",
      email: "hector.torres@cesa.com",
      carrera: "Ingeniería en Informática",
      semestre: "7",
      telefono: "341-123-4567",
      fechaRegistro: "2023-09-01",
      status: "Activo",
    },
    {
      numeroControl: "22290698",
      nombre: "Jairo Giovanni",
      apellido: "Álvarez Juárez",
      email: "jairo.alvarez@cesa.com",
      carrera: "Ingeniería en Informática",
      semestre: "7",
      telefono: "341-234-5678",
      fechaRegistro: "2023-09-02",
      status: "Activo",
    },
    {
      numeroControl: "22290699",
      nombre: "Oziel Ubaldo",
      apellido: "Venegas Nieves",
      email: "oziel.venegas@cesa.com",
      carrera: "Ingeniería en Informática",
      semestre: "7",
      telefono: "341-345-6789",
      fechaRegistro: "2023-09-03",
      status: "Activo",
    },
    {
      numeroControl: "22290700",
      nombre: "Santiago Abisai",
      apellido: "Gonzalez Garcia",
      email: "santiago.gonzalez@cesa.com",
      carrera: "Ingeniería en Informática",
      semestre: "7",
      telefono: "341-456-7890",
      fechaRegistro: "2023-09-04",
      status: "Activo",
    },
    {
      numeroControl: "22290697",
      nombre: "Alan Emiliano",
      apellido: "Garcia Lares",
      email: "alan.garcia@cesa.com",
      carrera: "Ingeniería en Informática",
      semestre: "7",
      telefono: "341-567-8901",
      fechaRegistro: "2023-09-05",
      status: "Activo",
    },
  ]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const handleDelete = (numeroControl) => {
    setStudents(students.filter((s) => s.numeroControl !== numeroControl));
  };

  // Filtrar estudiantes según search (solo se actualiza al presionar el botón)
  const filteredStudents = students.filter(
    (s) =>
      `${s.nombre} ${s.apellido}`.toLowerCase().includes(search.toLowerCase()) ||
      s.numeroControl.toLowerCase().includes(search.toLowerCase())
  );

  const handleSearch = () => {
    setSearch(searchInput); // Aplicar filtro
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Estudiantes</h1>
        <button className="mt-4 sm:mt-0 bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Agregar Estudiante
        </button>
      </div>

      {/* Barra de búsqueda con botón */}
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
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Buscar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Total Estudiantes" mainText={students.length} />
        <SummaryCard title="Nuevos Ingresos" mainText="56" />
        <SummaryCard title="Asistencia Promedio" mainText="92%" />
      </div>

      {/* Table */}
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.numeroControl} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{student.nombre} {student.apellido}</td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">{student.numeroControl}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.carrera}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.semestre}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.telefono}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{student.fechaRegistro}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    student.status === "Activo"
                      ? "bg-green-100 text-green-700"
                      : student.status === "En espera"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  {/* Edit */}
                  <button className="text-blue-600 hover:text-blue-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8-3-3-8 8z" />
                    </svg>
                  </button>
                  {/* Delete */}
                  <button onClick={() => handleDelete(student.numeroControl)} className="text-red-600 hover:text-red-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
          Mostrando {filteredStudents.length} de {students.length} estudiantes
        </div>
      </div>
    </div>
  );
}
