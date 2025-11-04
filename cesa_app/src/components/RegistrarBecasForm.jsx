import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createBeca } from "../services/api_becas_estudiante.js"; // Ajusta la ruta según tu estructura

const RegistrarBeca = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numero_control: "",
    tipo_beca: "",
    fecha_solicitud: "",
    fecha_aprobacion: "",
    fecha_entrega: "",
    fecha_fin: "",
    estatus: "",
    observaciones: "",
    notas_internas: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ⚠️ Validación: estudiante seleccionado
    if (!formData.numero_control) {
      Swal.fire({
        icon: "warning",
        title: "Falta seleccionar estudiante",
        text: "Debes elegir un estudiante antes de registrar la beca.",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    // 🌀 Mostrar modal de carga
    Swal.fire({
      title: "Registrando beca...",
      text: "Por favor espera unos segundos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const newBeca = {
        numero_control: formData.numero_control, // ya no se usa parseInt
        tipo_beca: formData.tipo_beca,
        fecha_solicitud: formData.fecha_solicitud || null,
        fecha_aprobacion: formData.fecha_aprobacion || null,
        fecha_entrega: formData.fecha_entrega || null,
        fecha_fin: formData.fecha_fin || null,
        estatus: formData.estatus,
        observaciones: formData.observaciones || "",
        notas_internas: formData.notas_internas || "",
      };

      await createBeca(newBeca);

      Swal.fire({
        icon: "success",
        title: "¡Beca registrada!",
        text: "La beca se registró correctamente.",
        confirmButtonColor: "#16a34a",
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirigir después de 2 segundos
      setTimeout(() => navigate("/becas"), 2000);
    } catch (error) {
      console.error("❌ Error registrando beca:", error);
      Swal.fire({
        icon: "error",
        title: "Error al registrar",
        text: "Ocurrió un error al registrar la beca. Intenta nuevamente.",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Registrar nueva beca
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Número de control */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Número de control
          </label>
          <input
            type="text"
            name="numero_control"
            value={formData.numero_control}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Tipo de beca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de beca
          </label>
          <input
            type="text"
            name="tipo_beca"
            value={formData.tipo_beca}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
          />
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha solicitud
            </label>
            <input
              type="date"
              name="fecha_solicitud"
              value={formData.fecha_solicitud}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha aprobación
            </label>
            <input
              type="date"
              name="fecha_aprobacion"
              value={formData.fecha_aprobacion}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha entrega
            </label>
            <input
              type="date"
              name="fecha_entrega"
              value={formData.fecha_entrega}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha fin
            </label>
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        {/* Estatus */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estatus
          </label>
          <select
            name="estatus"
            value={formData.estatus}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Selecciona un estatus</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Observaciones
          </label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>

        {/* Notas internas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Notas internas
          </label>
          <textarea
            name="notas_internas"
            value={formData.notas_internas}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transition"
        >
          Registrar beca
        </button>
      </form>
    </div>
  );
};

export default RegistrarBeca;
