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
} from "../services/api_miembros.js";

export default function Miembros() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showInteraccionModal, setShowInteraccionModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [members, setMembers] = useState([]);
  const [interacciones, setInteracciones] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, [search]);

  async function fetchMembers() {
    try {
      const data = await getMembers(search ? { q: search } : undefined);
      setMembers(data);
    } catch (err) {
      console.error("Error al obtener miembros:", err);
    }
  }

  const handleSearch = () => setSearch(searchInput);

  const handleDelete = async (nc) => {
    if (!window.confirm("¿Seguro que deseas eliminar este miembro?")) return;
    try {
      await deleteMember(nc);
      setMembers((prev) => prev.filter((m) => m.numero_control !== nc));
    } catch (err) {
      console.error("Error al eliminar miembro:", err);
    }
  };

  const handleEdit = (member) => {
    setSelectedMember({ ...member });
    setShowEditModal(true);
  };

  const openInteracciones = async (member) => {
    try {
      const data = await getInteractions(member.numero_control);
      setInteracciones(data || []);
      setSelectedMember(member);
      setShowInteraccionModal(true);
    } catch (err) {
      console.error("Error al obtener interacciones:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Miembros</h1>
        <div className="flex gap-3">
          <button
            className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer"
            onClick={() => {
              setSelectedMember(null);
              setShowEditModal(true);
            }}
          >
            + Agregar Miembro
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar por NC, nombre, correo, rol o coordinación..."
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard title="Miembros Totales" mainText={String(members.length)} subText="Registrados" />
        <SummaryCard title="Interacciones Registradas" mainText={String(interacciones.length)} subText="Hoy" />
        <SummaryCard title="Coordinaciones" mainText="--" subText="Activas" />
      </div>

      <MiembrosModal
        members={members}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        openInteracciones={openInteracciones}
      />

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
