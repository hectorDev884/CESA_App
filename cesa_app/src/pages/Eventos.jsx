import React, { useState, useMemo } from "react";
import EventosModal from "../components/EventosModal.jsx";

export default function Eventos() {
  const [eventos, setEventos] = useState([
    { id: 1, nombre: "Reunión de bienvenida", tipo: "Académico", fecha: "2025-02-10", ubicacion: "Auditorio", estatus: "Activo" },
    { id: 2, nombre: "Torneo de fútbol", tipo: "Deportivo", fecha: "2025-09-15", ubicacion: "Cancha principal", estatus: "Activo" },
    { id: 3, nombre: "Feria tecnológica", tipo: "Cultural", fecha: "2025-05-22", ubicacion: "Plaza principal", estatus: "Finalizado" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState(null);
  const [search, setSearch] = useState("");

  // --- 🧩 Función para quitar acentos y pasar a minúsculas
  function normalizarTexto(texto) {
    return texto
      ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      : "";
  }

  // --- 🔍 Filtrar eventos (ignora acentos y mayúsculas)
  const filteredEventos = useMemo(() => {
    const query = normalizarTexto(search);
    return eventos.filter(
      (e) =>
        normalizarTexto(e.nombre).includes(query) ||
        normalizarTexto(e.tipo).includes(query)
    );
  }, [eventos, search]);

  // --- 📆 Clasificar por semestre
  const semestreA = filteredEventos
    .filter((e) => {
      const mes = new Date(e.fecha).getMonth() + 1;
      return mes >= 1 && mes <= 7;
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  const semestreB = filteredEventos
    .filter((e) => {
      const mes = new Date(e.fecha).getMonth() + 1;
      return mes >= 8 && mes <= 12;
    })
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // --- ➕ Agregar evento
  const handleAdd = () => {
    setSelectedEvento(null);
    setShowModal(true);
  };

  // --- ✏️ Editar evento
  const handleEdit = (evento) => {
    setSelectedEvento(evento);
    setShowModal(true);
  };

  // --- 💾 Guardar evento
  const handleSave = (eventoData) => {
    if (eventoData.id) {
      setEventos(eventos.map((e) => (e.id === eventoData.id ? eventoData : e)));
    } else {
      setEventos([...eventos, { ...eventoData, id: Date.now() }]);
    }
    setShowModal(false);
  };

  // --- 🗑️ Eliminar evento
  const handleDelete = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este evento?")) {
      setEventos(eventos.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Eventos</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          onClick={handleAdd}
        >
          + Agregar Evento
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Buscar evento por nombre o tipo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* === SEMESTRE A === */}
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-[#036942] mb-4">
          📘 Semestre A (Enero - Julio)
        </h2>

        {semestreA.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estatus</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {semestreA.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{e.fecha}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{e.nombre}</td>
                    <td className="px-4 py-3 text-sm text-green-700">{e.tipo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{e.ubicacion}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          e.estatus === "Activo"
                            ? "bg-green-100 text-green-700"
                            : e.estatus === "Cancelado"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {e.estatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(e)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(e.id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay eventos registrados en este semestre.</p>
        )}
      </div>

      {/* === SEMESTRE B === */}
      <div>
        <h2 className="text-2xl font-semibold text-[#036942] mb-4">
          📗 Semestre B (Agosto - Diciembre)
        </h2>

        {semestreB.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ubicación</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estatus</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {semestreB.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{e.fecha}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{e.nombre}</td>
                    <td className="px-4 py-3 text-sm text-green-700">{e.tipo}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{e.ubicacion}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          e.estatus === "Activo"
                            ? "bg-green-100 text-green-700"
                            : e.estatus === "Cancelado"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {e.estatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex justify-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEdit(e)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDelete(e.id)}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No hay eventos registrados en este semestre.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <EventosModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          eventoData={selectedEvento}
          eventos={eventos}
        />
      )}
    </div>
  );
}