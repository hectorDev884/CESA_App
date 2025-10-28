// src/pages/Miembros.jsx
import React, { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import { useNavigate } from "react-router-dom";
import EditarMiembroModal from "../components/EditarMiembroModal.jsx";
import InteraccionModal from "../components/InteraccionModal.jsx";
import MiembrosModal from "../components/MiembrosModal.jsx";
import {
  getMembers,
  deleteMember,
  getInteractions,
  getAllInteractions,
  deleteInteraction,
} from "../services/api_miembros.js";
import NewInteraccionModal from "../components/NewInteraccionModal.jsx";

export default function Miembros() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [currentView, setCurrentView] = useState("Miembros");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInteraccionModal, setShowInteraccionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [interacciones, setInteracciones] = useState([]);
  const [showNewInteractionModal, setShowNewInteractionModal] = useState(false);
  const [editingInteraction, setEditingInteraction] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Solo obtener miembros cuando la vista actual sea 'Miembros'
    if (currentView === "Miembros") fetchMembers();
    if (currentView === "Interacciones") fetchAllInteracciones();
  }, [search, currentView]);

  const fetchAllInteracciones = async () => {
    try {
      const all = await getAllInteractions();
      setInteracciones(all || []);
    } catch (err) {
      console.error("Error al obtener interacciones:", err);
      setInteracciones([]);
    }
  };

  const handleEditInteraction = (it) => {
    setEditingInteraction(it);
    setShowNewInteractionModal(true);
  };

  const handleDeleteInteraction = async (it) => {
    if (!window.confirm("¿Eliminar esta interacción?")) return;
    try {
      await deleteInteraction(it.from, it.timestamp);
      fetchAllInteracciones();
    } catch (e) {
      console.error(e);
      alert("Error al eliminar interacción");
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "--";
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch (e) {
      return ts;
    }
  };

  async function fetchMembers() {
    try {
      // La búsqueda se realiza en la API y los resultados filtran la tabla.
      const data = await getMembers(search ? { q: search } : undefined);
      setMembers(data);
    } catch (err) {
      console.error("Error al obtener miembros:", err);
    }
  }

  // Habilita la búsqueda al actualizar el estado 'search'
  const handleSearch = () => setSearch(searchInput);

  const handleDelete = async (nc) => {
    // 💥 MODIFICACIÓN: Confirmación de eliminación con NC.
    if (!window.confirm(`¿Seguro que deseas eliminar el miembro con NC: ${nc}? (Sí/No)`)) return;
    try {
      await deleteMember(nc);
      setMembers((prev) => prev.filter((m) => m.numero_control !== nc));
    } catch (err) {
      console.error("Error al eliminar miembro:", err);
    }
  };

  const handleEdit = (member) => {
    // Al editar (o ver detalles del buscado), se abre el modal.
    setSelectedMember({ ...member });
    setShowEditModal(true);
  };

  

  const showView = (view) => {
    setCurrentView(view);
    // Si el usuario pide ver miembros, traer todos (sin búsqueda)
    if (view === "Miembros") {
      setSearchInput("");
      setSearch("");
      fetchMembers();
    }
    // Por ahora las interacciones y coordinaciones son tablas estáticas/placeholder
    if (view === "Interacciones") {
      // limpiar selección de miembro y recargar interacciones
      setSelectedMember(null);
      fetchAllInteracciones();
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Miembros</h1>
        <div className="flex gap-3">
          {/* placeholder for right-side controls if needed */}
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-2 items-center">
        <input
          type="text"
          placeholder="Buscar por NC, nombre, correo, rol o coordinación..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <div className="flex items-center">
          <button
            onClick={handleSearch} // Botón de búsqueda habilitado
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer"
          >
            Buscar
          </button>
          {/* Botón secundario — su texto cambia según la vista seleccionada. No muy pegado al botón Buscar */}
          <button
            onClick={() => {
              if (currentView === "Miembros") {
                setSelectedMember(null);
                setShowEditModal(true);
              } else if (currentView === "Interacciones") {
                // acción para nueva interaccion (abre modal global)
                setShowNewInteractionModal(true);
              }
            }}
            className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 ml-4 hover:cursor-pointer"
          >
            {currentView === "Miembros" && "+ Agregar Miembro"}
            {currentView === "Interacciones" && "Nueva interaccion"}
            {/* Coordinaciones ya no es una vista separada */}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Miembros Totales"
          mainText={String(members.length)}
          subText="Registrados"
          buttonText="Ver miembros"
          onButtonClick={() => showView("Miembros")}
        />
        <SummaryCard
          title="Interacciones Registradas"
          mainText={String(interacciones.length)}
          subText="Hoy"
          buttonText="Ver interacciones"
          onButtonClick={() => showView("Interacciones")}
        />
        {/* Coordinaciones eliminado por petición: ahora se maneja como select en el modal de miembro */}
      </div>

      {/* Contenido principal dinámico según la vista seleccionada */}
      {currentView === "Miembros" && (
        <MiembrosModal members={members} handleEdit={handleEdit} handleDelete={handleDelete} />
      )}

      {currentView === "Interacciones" && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Desde</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Para</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Mensaje</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {interacciones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-sm text-gray-500">
                    No hay interacciones registradas.
                  </td>
                </tr>
              ) : (
                interacciones.map((it, idx) => (
                  <tr key={it.timestamp || idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(it.timestamp)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{it.from}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{it.to}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{it.tipo || "--"}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{it.message || "--"}</td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => handleEditInteraction(it)}>✏️</button>
                      <button className="text-red-600 hover:text-red-800 cursor-pointer" onClick={() => handleDeleteInteraction(it)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">Mostrando {interacciones.length} interacciones</div>
        </div>
      )}

      {showNewInteractionModal && (
        <NewInteraccionModal
          onClose={() => { setShowNewInteractionModal(false); setEditingInteraction(null); }}
          onSaved={() => fetchAllInteracciones()}
          initial={editingInteraction}
        />
      )}

      {/* Coordinaciones eliminado — ahora se elige en el modal de miembro */}

      {showEditModal && (
        <EditarMiembroModal
          onClose={() => {
            setShowEditModal(false);
            setSelectedMember(null);
            fetchMembers();
          }}
          memberData={selectedMember}
        />
      )}

      {showInteraccionModal && selectedMember && (
        <InteraccionModal
          onClose={() => {
            setShowInteraccionModal(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
        />
      )}
    </div>
  );
}