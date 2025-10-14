import React, { useState, useEffect } from "react";

export default function FinanzasModal({ onClose, onSave, registro, modoEdicion }) {
  const [formData, setFormData] = useState({
    concepto: "",
    tipo: "Ingreso",
    monto: "",
    categoria: "",
    fecha: "",
  });

  useEffect(() => {
    if (registro) setFormData(registro);
  }, [registro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          {modoEdicion ? "Editar Registro Financiero" : "Nuevo Registro Financiero"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Concepto</label>
            <input
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              {modoEdicion ? "Guardar Cambios" : "Agregar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
