import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function EditarBecaModal({ onClose, onSave, becaData }) {
  const [formData, setFormData] = useState({
    beca_id: "",
    numero_control: "",
    tipo_beca: "alimenticia",
    fecha_solicitud: new Date().toISOString().split("T")[0],
    fecha_aprobacion: "",
    fecha_entrega: "",
    fecha_fin: "",
    estatus: "pendiente",
    observaciones: "",
    notas_internas: "",
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
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.numero_control.toString().trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta número de control",
        text: "Por favor ingresa el número de control del estudiante.",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    // 🌀 Mostrar modal de carga
    Swal.fire({
      title: "Guardando cambios...",
      text: "Por favor espera unos segundos.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const dataToSave = {
        ...formData,
        fecha_fin: formData.fecha_fin || null,
      };

      await onSave(dataToSave);

      Swal.fire({
        icon: "success",
        title: "¡Cambios guardados!",
        text: "La beca se actualizó correctamente.",
        confirmButtonColor: "#16a34a",
        timer: 1800,
        showConfirmButton: false,
      });

      setTimeout(() => onClose(), 1800);
    } catch (error) {
      console.error("❌ Error al guardar la beca:", error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "Ocurrió un problema al guardar los cambios. Intenta nuevamente.",
        confirmButtonColor: "#dc2626",
      });
    }
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
          Editar Información de Beca
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Beca
              </label>
              <select
                name="tipo_beca"
                value={formData.tipo_beca || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="alimenticia">Alimenticia</option>
                <option value="transporte">Transporte</option>
                <option value="académica">Académica</option>
                <option value="deportiva">Deportiva</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Solicitud
                </label>
                <input
                  type="date"
                  name="fecha_solicitud"
                  value={formData.fecha_solicitud || ""}
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
                  name="fecha_aprobacion"
                  value={formData.fecha_aprobacion || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Entrega
                </label>
                <input
                  type="date"
                  name="fecha_entrega"
                  value={formData.fecha_entrega || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin || ""}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estatus
              </label>
              <select
                name="estatus"
                value={formData.estatus || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="pendiente">Pendiente</option>
                <option value="aprobada">Aprobada</option>
                <option value="rechazada">Rechazada</option>
                <option value="entregada">Entregada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                name="observaciones"
                value={formData.observaciones || ""}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas Internas
              </label>
              <textarea
                name="notas_internas"
                value={formData.notas_internas || ""}
                onChange={handleChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo (opcional)
              </label>
              <input
                type="file"
                name="archivo"
                onChange={() => {}}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

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
