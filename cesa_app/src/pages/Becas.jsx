import React, { useState } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import { useNavigate } from "react-router-dom";
import CalendarioModal from "../components/CalendarioModal.jsx";
import EditarBecasModal from "../components/EditarBecasModal.jsx"; // 👈 nuevo modal de edición

export default function Becas() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false); // modal de calendario
  const [showEditModal, setShowEditModal] = useState(false); // 👈 modal de edición
  const [selectedBeca, setSelectedBeca] = useState(null); // 👈 beca que se está editando
  const navigate = useNavigate();

  const [becas, setBecas] = useState([
    {
      id: 1,
      estudiante: "Héctor Manuel Torres Cuevas",
      tipo: "Alimenticia",
      fechaInicio: "2024-02-01",
      fechaFin: "2025-02-01",
      estado: "Activa",
    },
    {
      id: 2,
      estudiante: "Jairo Giovanni Álvarez Juárez",
      tipo: "Alimenticia",
      fechaInicio: "2024-03-01",
      fechaFin: "2025-03-01",
      estado: "Pendiente de revisión",
    },
    {
      id: 3,
      estudiante: "Oziel Ubaldo Venegas Nieves",
      tipo: "Alimenticia",
      fechaInicio: "2023-09-01",
      fechaFin: "2024-09-01",
      estado: "Finalizada",
    },
  ]);

  const handleSearch = () => setSearch(searchInput);

  const filteredBecas = becas.filter(
    (b) =>
      b.estudiante.toLowerCase().includes(search.toLowerCase()) ||
      b.tipo.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setBecas(becas.filter((b) => b.id !== id));
  };

  const handleGenerateCalendar = (data) => {
    console.log("📅 Datos del calendario generados:", data);
    setShowModal(false);
  };

  // 👇 abrir modal de edición
  const handleEdit = (beca) => {
    setSelectedBeca({
      ID_Estudiante: beca.id,
      Tipo_Beca: beca.tipo,
      Fecha_Solicitud: beca.fechaInicio,
      Fecha_Aprobacion: "",
      Fecha_Entrega: beca.fechaFin,
      Estatus: beca.estado,
      Observaciones: "",
      Notas_Internas: "",
      archivo: null,
    });
    setShowEditModal(true);
  };

  // 👇 guardar cambios
  const handleSaveEdit = (formData) => {
    console.log("💾 Datos guardados:", formData);

    setBecas((prev) =>
      prev.map((b) =>
        b.id === formData.ID_Estudiante
          ? {
              ...b,
              tipo: formData.Tipo_Beca,
              fechaInicio: formData.Fecha_Solicitud,
              fechaFin: formData.Fecha_Entrega,
              estado: formData.Estatus,
            }
          : b
      )
    );

    setShowEditModal(false);
    setSelectedBeca(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Becas</h1>
        <div className="flex gap-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
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
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar beca por estudiante o tipo..."
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

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Becas Activas" mainText="12" subText="En curso actualmente" />
        <SummaryCard title="Pendientes de Revisión" mainText="3" subText="En espera de aprobación" />
        <SummaryCard title="Becas Finalizadas" mainText="5" subText="Concluidas este año" />
      </div>

      {/* Tabla de becas */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estudiante</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo de Beca</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Inicio</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Fin</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBecas.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{b.estudiante}</td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">{b.tipo}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.fechaInicio}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.fechaFin}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      b.estado === "Activa"
                        ? "bg-green-100 text-green-700"
                        : b.estado === "Pendiente de revisión"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {b.estado}
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
                    onClick={() => handleDelete(b.id)}
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
          Mostrando {filteredBecas.length} de {becas.length} becas
        </div>
      </div>

      {/* Modal de calendario */}
      {showModal && (
        <CalendarioModal
          onClose={() => setShowModal(false)}
          onGenerate={handleGenerateCalendar}
        />
      )}

      {/* Modal de edición */}
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
