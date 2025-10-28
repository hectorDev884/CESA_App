import React, { useState, useEffect } from "react";

export default function EditarEstudianteModal({ onClose, onSave, estudianteData }) {
  const [formData, setFormData] = useState({
    numero_control: "",
    nombre: "",
    apellido: "",
    email: "",
    carrera: "",
    semestre: 1,
    telefono: "",
    fecha_registro: "",
  });

  useEffect(() => {
    if (estudianteData) {
      setFormData({
        ...formData,
        ...estudianteData,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudianteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.numero_control.toString().trim()) {
      alert("Por favor ingresa el número de control del estudiante.");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl relative animate-fadeIn border border-gray-200 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute hover:cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 text-lg transition-colors"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Editar Estudiante
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número de Control</label>
              <input
                type="text"
                name="numero_control"
                value={formData.numero_control || ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Carrera</label>
              <input
                type="text"
                name="carrera"
                value={formData.carrera || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semestre</label>
              <input
                type="number"
                name="semestre"
                value={formData.semestre || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                min={1}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Registro</label>
              <input
                type="date"
                name="fecha_registro"
                value={formData.fecha_registro ? formData.fecha_registro.split("T")[0] : ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 hover:cursor-pointer transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer transition-colors font-medium"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
