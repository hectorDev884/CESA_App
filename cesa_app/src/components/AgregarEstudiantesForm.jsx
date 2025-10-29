import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createEstudiante } from "../services/api_becas_estudiante.js";

export default function EstudianteForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    numero_control: "",
    nombre: "",
    apellido: "",
    email: "",
    carrera: "Ing. Informatica",
    semestre: "7",
    telefono: "",
    fecha_registro: new Date().toISOString().split("T")[0],
  });

  const carreras = [
    "Ing. Informatica",
    "Ing. Sistemas Computacionales",
    "Ing. Ambiental",
    "Ing. Industrial",
    "Ing. Gestion Empresarial",
    "Ing. Inteligencia Artificial",
    "Ing. Semiconductores",
    "Ing. Electrica",
    "Ing. Electronica",
    "Contador Publico",
    "Arquitectura",
    "Ing. Mecanica",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const numControlRegex = /^[0-9]{8}$/;
    const nameRegex = /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/; // opcional

    if (!numControlRegex.test(formData.numero_control)) {
      Swal.fire({
        icon: "warning",
        title: "Número de control inválido",
        text: "Debe tener exactamente 8 dígitos numéricos.",
      });
      return false;
    }

    if (!nameRegex.test(formData.nombre)) {
      Swal.fire({
        icon: "warning",
        title: "Nombre inválido",
        text: "El nombre solo puede contener letras y espacios.",
      });
      return false;
    }

    if (!nameRegex.test(formData.apellido)) {
      Swal.fire({
        icon: "warning",
        title: "Apellido inválido",
        text: "El apellido solo puede contener letras y espacios.",
      });
      return false;
    }

    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "warning",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return false;
    }

    if (formData.telefono && !phoneRegex.test(formData.telefono)) {
      Swal.fire({
        icon: "warning",
        title: "Teléfono inválido",
        text: "Debe tener exactamente 10 dígitos numéricos.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await createEstudiante(formData);

      Swal.fire({
        icon: "success",
        title: "Estudiante creado",
        text: "El estudiante se ha registrado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      setTimeout(() => navigate("/estudiantes"), 2000);
    } catch (err) {
      console.error("❌ Error al crear estudiante:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error al crear el estudiante.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Agregar Estudiante</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Número de Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Número de Control</label>
          <input
            type="text"
            name="numero_control"
            value={formData.numero_control}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            maxLength={8}
          />
        </div>

        {/* Nombre y Apellido */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Opcional, 10 dígitos"
          />
        </div>

        {/* Carrera */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Carrera</label>
          <select
            name="carrera"
            value={formData.carrera}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {carreras.map((carrera, index) => (
              <option key={index} value={carrera}>
                {carrera}
              </option>
            ))}
          </select>
        </div>

        {/* Semestre */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Semestre</label>
          <select
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg hover:cursor-pointer ${
              loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}
