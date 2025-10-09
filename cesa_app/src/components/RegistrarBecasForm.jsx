import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RegistrarBecaForm() {
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, archivo: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nueva beca registrada:", formData);

    // Para enviar a tu API (ejemplo con fetch):
    // const data = new FormData();
    // Object.entries(formData).forEach(([key, value]) => {
    //   data.append(key, value);
    // });
    // fetch("/api/becas", { method: "POST", body: data });

    navigate("/"); // Redirigir después del registro
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Beca</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* ID Estudiante */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ID del Estudiante</label>
          <input
            type="number"
            name="ID_Estudiante"
            value={formData.ID_Estudiante}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Tipo de Beca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Beca</label>
          <select
            name="Tipo_Beca"
            value={formData.Tipo_Beca}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Alimentos">Alimentos</option>
            <option value="Transporte">Transporte</option>
            <option value="Residencia">Residencia</option>
            <option value="Académica">Académica</option>
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Solicitud</label>
            <input
              type="date"
              name="Fecha_Solicitud"
              value={formData.Fecha_Solicitud}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Aprobación</label>
            <input
              type="date"
              name="Fecha_Aprobacion"
              value={formData.Fecha_Aprobacion}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
            <input
              type="date"
              name="Fecha_Entrega"
              value={formData.Fecha_Entrega}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Estatus */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Estatus</label>
          <select
            name="Estatus"
            value={formData.Estatus}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Pendiente">Pendiente</option>
            <option value="Aprobada">Aprobada</option>
            <option value="Entregada">Entregada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea
            name="Observaciones"
            value={formData.Observaciones}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        {/* Notas Internas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notas Internas</label>
          <textarea
            name="Notas_Internas"
            value={formData.Notas_Internas}
            onChange={handleChange}
            rows="2"
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          ></textarea>
        </div>

        {/* Archivos */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Subir archivos (foto, comprobantes, etc.)</label>
          <input
            type="file"
            name="archivo"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
            className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
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
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
