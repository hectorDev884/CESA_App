import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

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

  const carreras = [
    "Ing. Informática",
    "Ing. Sistemas Computacionales",
    "Ing. Ambiental",
    "Ing. Industrial",
    "Ing. Gestión Empresarial",
    "Ing. Inteligencia Artificial",
    "Ing. Semiconductores",
    "Ing. Eléctrica",
    "Ing. Electrónica",
    "Contador Público",
    "Arquitectura",
    "Mecánica",
  ];

  useEffect(() => {
    if (estudianteData) {
      setFormData({ ...formData, ...estudianteData });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estudianteData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "nombre" || name === "apellido") {
      const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]*$/;
      if (!regex.test(value)) return;
    }

    if (name === "telefono") {
      const regex = /^[0-9]*$/;
      if (!regex.test(value) || value.length > 10) return;
    }

    if (name === "semestre" && (value < 1 || value > 12)) {
      Swal.fire({
        icon: "warning",
        title: "Semestre inválido",
        text: "El semestre debe estar entre 1 y 12.",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    // ✅ Validar número de control: 8 dígitos, con o sin prefijo de una letra
    if (!/^[A-Za-z]?\d{8}$/.test(formData.numero_control)) {
      Swal.fire({
        icon: "error",
        title: "Número de control inválido",
        text: "Debe tener 8 dígitos, con o sin una letra al inicio (ej. L22290696 o 22290696).",
      });
      return false;
    }

    if (!formData.nombre.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.nombre)) {
      Swal.fire({
        icon: "error",
        title: "Nombre inválido",
        text: "El nombre solo debe contener letras y espacios.",
      });
      return false;
    }

    if (!formData.apellido.trim() || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(formData.apellido)) {
      Swal.fire({
        icon: "error",
        title: "Apellido inválido",
        text: "El apellido solo debe contener letras y espacios.",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Correo electrónico inválido",
        text: "Por favor ingresa un correo válido.",
      });
      return false;
    }

    if (formData.telefono && !/^\d{10}$/.test(formData.telefono)) {
      Swal.fire({
        icon: "error",
        title: "Teléfono inválido",
        text: "El número telefónico debe tener 10 dígitos.",
      });
      return false;
    }

    if (!formData.carrera.trim()) {
      Swal.fire({
        icon: "error",
        title: "Carrera requerida",
        text: "Por favor selecciona una carrera.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave(formData);
    Swal.fire({
      icon: "success",
      title: "Estudiante actualizado",
      text: "Los datos se guardaron correctamente.",
      timer: 1500,
      showConfirmButton: false,
    });
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Control
              </label>
              <input
                type="text"
                name="numero_control"
                value={formData.numero_control || ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 outline-none"
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
              <select
                name="carrera"
                value={formData.carrera || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="">Selecciona una carrera</option>
                {carreras.map((carrera) => (
                  <option key={carrera} value={carrera}>
                    {carrera}
                  </option>
                ))}
              </select>
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
                max={12}
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
                maxLength={10}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Registro
              </label>
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
