import React, { useState } from "react";

const COLOR_MAP = {
  red: "Rojo",
  green: "Verde",
  blue: "Azul",
  orange: "Naranja",
  purple: "Morado",
  teal: "Verde Azulado",
  yellow: "Amarillo",
  pink: "Rosa",
  gray: "Gris",
  brown: "Marrón",
};

export default function CalendarioModal({ onClose, onGenerate, onGenerateAll }) {
  const [nc, setNc] = useState("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [color, setColor] = useState("red");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nc.trim()) {
      alert("Por favor ingresa el número de control del estudiante.");
      return;
    }

    if (!fecha_inicio || !fecha_fin) {
      alert("Por favor selecciona ambas fechas.");
      return;
    }

    onGenerate({
      nc,
      fecha_inicio,
      fecha_fin,
      color,
    });
  };

  const handleGenerateAll = () => {
    if (!fecha_inicio || !fecha_fin) {
      alert("Por favor selecciona el rango de fechas.");
      return;
    }

    onGenerateAll({
      fecha_inicio,
      fecha_fin,
      color,
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
              value={fecha_inicio}
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
              value={fecha_fin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Selector de color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color del encabezado
            </label>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              {Object.entries(COLOR_MAP).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3 mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
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
                Generar uno
              </button>
            </div>

            {/* 🧾 Botón adicional para todas las becas */}
            <button
              type="button"
              onClick={handleGenerateAll}
              className="bg-blue-600 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium hover:cursor-pointer"
            >
              Generar calendario de todas las becas actuales
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
