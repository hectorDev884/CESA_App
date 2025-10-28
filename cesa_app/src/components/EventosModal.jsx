import React, { useState, useEffect } from "react";

export default function EventosModal({ onClose, onSave, eventoData, eventos }) {
  // 🔹 Detectar semestre actual automáticamente
  const obtenerSemestreActual = () => {
    const mes = new Date().getMonth() + 1;
    return mes >= 1 && mes <= 6 ? "A" : "B";
  };

  const [formData, setFormData] = useState({
    nombre: "",
    tipo: "",
    fecha: "",
    hora: "",
    ubicacion: "",
    estatus: "Activo",
    semestre: obtenerSemestreActual(),
  });

  // Normalizar texto (para evitar duplicados)
  const normalizarTexto = (texto) =>
    texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim() : "";

  // Cargar datos si se está editando
  useEffect(() => {
    if (eventoData) {
      // 🔄 Modo edición: incluir el id
      setFormData({
        id: eventoData.id,
        nombre: eventoData.nombre || "",
        tipo: eventoData.tipo || "",
        fecha: eventoData.fecha || "",
        hora: eventoData.hora || "",
        ubicacion: eventoData.ubicacion || "",
        estatus: eventoData.estatus || "Activo",
        semestre: eventoData.semestre || obtenerSemestreActual(),
      });
    } else {
      // ➕ Modo nuevo: sin id
      setFormData({
        nombre: "",
        tipo: "",
        fecha: "",
        hora: "",
        ubicacion: "",
        estatus: "Activo",
        semestre: obtenerSemestreActual(),
      });
    }
  }, [eventoData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (!formData.nombre.trim() || !formData.tipo.trim() || !formData.fecha || !formData.hora || !formData.ubicacion.trim()) {
      alert("⚠️ Por favor, completa todos los campos requeridos.");
      return;
    }

    const nombreNormalizado = normalizarTexto(formData.nombre);
    const tipoNormalizado = normalizarTexto(formData.tipo);

    // Verificar duplicados (mismo nombre y tipo)
    const duplicado = eventos.some(
      (ev) =>
        ev.id !== formData.id && // Excluir el evento actual en edición
        normalizarTexto(ev.nombre) === nombreNormalizado &&
        normalizarTexto(ev.tipo) === tipoNormalizado
    );

    if (duplicado) {
      alert("⚠️ Ya existe un evento con el mismo nombre y tipo.");
      return;
    }

    // Enviar datos al componente padre
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {eventoData ? "Editar Evento" : "Agregar Evento"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del evento *
            </label>
            <input
              type="text"
              name="nombre"
              placeholder="Ej: Torneo de Fútbol"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de evento *
            </label>
            <input
              type="text"
              name="tipo"
              placeholder="Ej: Deportivo, Cultural, Académico"
              value={formData.tipo}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora *
            </label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación *
            </label>
            <input
              type="text"
              name="ubicacion"
              placeholder="Ej: Cancha principal, Auditorio"
              value={formData.ubicacion}
              onChange={handleChange}
              required
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estatus
            </label>
            <select
              name="estatus"
              value={formData.estatus}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            >
              <option value="Activo">Activo</option>
              <option value="Cancelado">Cancelado</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semestre
            </label>
            <select
              name="semestre"
              value={formData.semestre}
              onChange={handleChange}
              className="border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
            >
              <option value="A">Semestre A</option>
              <option value="B">Semestre B</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {eventoData ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


