import React, { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import { useNavigate } from "react-router-dom";
import CalendarioModal from "../components/CalendarioModal.jsx";
import EditarBecasModal from "../components/EditarBecasModal.jsx";
import {
  getBecas,
  updateBeca,
  deleteBeca,
} from "../services/api_becas_estudiante.js"; // backend real

export default function Becas() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBeca, setSelectedBeca] = useState(null);
  const [becas, setBecas] = useState([]);
  const navigate = useNavigate();

  // --- 🔄 Traer becas del backend
  useEffect(() => {
    fetchBecas();
  }, [search]); // recarga cada vez que cambie la búsqueda

  async function fetchBecas() {
    try {
      const query = search ? `search=${encodeURIComponent(search)}` : "";
      const data = await getBecas(query);
      setBecas(data);
    } catch (err) {
      console.error("❌ Error al obtener becas:", err);
    }
  }

  // --- 🔍 Buscar
  const handleSearch = () => {
    setSearch(searchInput);
  };

  // --- 🗑️ Eliminar beca
  const handleDelete = async (becaId) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta beca?")) return;
    try {
      await deleteBeca(becaId);
      setBecas(becas.filter((b) => b.beca_id !== becaId));
    } catch (err) {
      console.error("❌ Error al eliminar beca:", err);
    }
  };

  // --- 📅 Generar calendario (solo front)
  const handleGenerateCalendar = (data) => {
    console.log("📅 Datos del calendario generados:", data);
    setShowModal(false);
  };

  // --- ✏️ Abrir modal de edición
  const handleEdit = (beca) => {
    setSelectedBeca({ ...beca });
    setShowEditModal(true);
  };

  // --- 💾 Guardar cambios
  const handleSaveEdit = async (formData) => {
    try {
      const updated = await updateBeca(formData.beca_id, formData);
      setBecas((prev) =>
        prev.map((b) => (b.beca_id === formData.beca_id ? updated : b))
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar Beca
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar beca por estudiante, tipo o estatus..."
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Becas Activas" mainText="12" subText="En curso actualmente" />
        <SummaryCard title="Pendientes de Revisión" mainText="3" subText="En espera de aprobación" />
        <SummaryCard title="Becas Finalizadas" mainText="5" subText="Concluidas este año" />
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Número Control</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo de Beca</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Solicitud</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha Entrega</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estatus</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {becas.map((b) => (
              <tr key={b.beca_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{b.numero_control}</td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">{b.tipo_beca}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.fecha_solicitud}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{b.fecha_entrega}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      b.estatus === "Activa"
                        ? "bg-green-100 text-green-700"
                        : b.estatus === "Pendiente de revisión"
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
          Mostrando {becas.length} becas
        </div>
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
