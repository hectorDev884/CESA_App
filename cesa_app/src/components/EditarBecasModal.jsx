import React, { useState, useEffect } from "react";

export default function EditarBecaModal({ onClose, onSave, becaData }) {
  const [formData, setFormData] = useState({
    ID_Estudiante: "",
    Tipo_Beca: "Alimentos",
    Fecha_Solicitud: new Date().toISOString().split("T")[0],
    Fecha_Aprobacion: "",
    Fecha_Entrega: "",
    Estatus: "Pendiente",
    Observaciones: "",
    Notas_Internas: "",
    archivo: null,
  });

  useEffect(() => {
    if (becaData) {
      setFormData((prev) => ({
        ...prev,
        ...becaData,
      }));
    }
  }, [becaData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.ID_Estudiante.trim()) {
      alert("Por favor ingresa el ID del estudiante.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div
        className="
          bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl 
          relative animate-fadeIn border border-gray-200 
          max-h-[90vh] overflow-y-auto
        "
      >
        {/* Botón de cerrar */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg transition-colors"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Título */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Editar Información de Beca
        </h2>

        {/* Formulario en dos columnas */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            {/* ID del estudiante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID del Estudiante
              </label>
              <input
                type="text"
                name="ID_Estudiante"
                value={formData.ID_Estudiante}
                onChange={handleChange}
                placeholder="Ejemplo: 213040123"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Tipo de beca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Beca
              </label>
              <select
                name="Tipo_Beca"
                value={formData.Tipo_Beca}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Alimentos">Alimentos</option>
                <option value="Transporte">Transporte</option>
                <option value="Académica">Académica</option>
                <option value="Deportiva">Deportiva</option>
              </select>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Solicitud
                </label>
                <input
                  type="date"
                  name="Fecha_Solicitud"
                  value={formData.Fecha_Solicitud}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Aprobación
                </label>
                <input
                  type="date"
                  name="Fecha_Aprobacion"
                  value={formData.Fecha_Aprobacion}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Entrega
              </label>
              <input
                type="date"
                name="Fecha_Entrega"
                value={formData.Fecha_Entrega}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            {/* Estatus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estatus
              </label>
              <select
                name="Estatus"
                value={formData.Estatus}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="Entregada">Entregada</option>
              </select>
            </div>

            {/* Observaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="Observaciones"
                value={formData.Observaciones}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              ></textarea>
            </div>

            {/* Notas internas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Internas
              </label>
              <textarea
                name="Notas_Internas"
                value={formData.Notas_Internas}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              ></textarea>
            </div>

            {/* Archivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo (opcional)
              </label>
              <input
                type="file"
                name="archivo"
                onChange={handleChange}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Botones (abajo, en ambas columnas) */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
