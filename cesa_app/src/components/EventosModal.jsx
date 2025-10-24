import React, { useState, useEffect } from "react";

export default function EventosModal({ onClose, onSave, eventoData, eventos }) {
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    tipo: "",
    fecha: "",
    ubicacion: "",
    estatus: "Activo",
  });

  // 🧩 Función para normalizar texto (quita acentos y pasa a minúsculas)
  const normalizarTexto = (texto) =>
    texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";

  // 🧠 Si se está editando, carga los datos
  useEffect(() => {
    if (eventoData) setFormData(eventoData);
  }, [eventoData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔍 Comprobación de duplicados (ignorando acentos, mayúsculas y espacios)
    const nombreNormalizado = normalizarTexto(formData.nombre.trim());
    const tipoNormalizado = normalizarTexto(formData.tipo.trim());

    const duplicado = eventos.some(
      (ev) =>
        ev.id !== formData.id &&
        normalizarTexto(ev.nombre.trim()) === nombreNormalizado &&
        normalizarTexto(ev.tipo.trim()) === tipoNormalizado
    );

    if (duplicado) {
      alert("⚠️ Ya existe un evento con el mismo nombre y tipo (sin importar mayúsculas o acentos).");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {formData.id ? "Editar Evento" : "Agregar Evento"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre del evento"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            name="tipo"
            placeholder="Tipo de evento (Deportivo, Cultural...)"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            name="ubicacion"
            placeholder="Ubicación"
            value={formData.ubicacion}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <select
            name="estatus"
            value={formData.estatus}
            onChange={handleChange}
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="Activo">Activo</option>
            <option value="Cancelado">Cancelado</option>
            <option value="Finalizado">Finalizado</option>
          </select>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
