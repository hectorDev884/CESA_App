import React, { useState } from "react";

export default function CalendarioModal({ onClose, onGenerate }) {
  const [nc, setNc] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nc.trim()) {
      alert("Por favor ingresa el número de control del estudiante.");
      return;
    }

    if (!fechaInicio || !fechaFin) {
      alert("Por favor selecciona ambas fechas.");
      return;
    }

    onGenerate({
      nc,
      fechaInicio,
      fechaFin,
    });
  };

  return (
    <div className="fixed inset-0 bg-opacity-20 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative animate-fadeIn border border-gray-200">
        {/* Botón de cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg transition-colors hover:cursor-pointer"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Título */}
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
          Generar Calendario de Asistencia
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Número de control */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Control (NC)
            </label>
            <input
              type="text"
              value={nc}
              onChange={(e) => setNc(e.target.value)}
              placeholder="Ejemplo: 213040123"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Fecha de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium hover:cursor-pointer"
            >
              Generar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}