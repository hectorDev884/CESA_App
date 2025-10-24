import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getEstudiantes, createBeca } from "../services/api_becas_estudiante.js";

export default function RegistrarBecaForm() {
  const navigate = useNavigate();

  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchEstudiante, setSearchEstudiante] = useState(""); // Para filtrar
  const [formData, setFormData] = useState({
    numero_control: "",
    tipo_beca: "Alimenticia",
    fecha_solicitud: new Date().toISOString().split("T")[0],
    fecha_aprobacion: "",
    fecha_entrega: "",
    fecha_fin: "",
    estatus: "pendiente",
    observaciones: "",
    notas_internas: "",
  });

  // 🔄 Obtener estudiantes
  useEffect(() => {
    async function fetchEstudiantes() {
      try {
        const data = await getEstudiantes();
        setEstudiantes(data);
      } catch (err) {
        console.error("Error cargando estudiantes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchEstudiantes();
  }, []);

  // 🖋️ Manejo de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearchChange = (e) => {
    setSearchEstudiante(e.target.value);
  };

  // 🔍 Filtrar estudiantes por búsqueda
  const filteredEstudiantes = estudiantes.filter(
    (est) =>
      est.nombre.toLowerCase().includes(searchEstudiante.toLowerCase()) ||
      est.apellido.toLowerCase().includes(searchEstudiante.toLowerCase()) ||
      String(est.numero_control).includes(searchEstudiante)
  );

  // Solo mostrar los primeros 10 si no hay búsqueda
  const displayedEstudiantes =
    searchEstudiante.trim() === ""
      ? filteredEstudiantes.slice(0, 10)
      : filteredEstudiantes;

  // 📨 Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newBeca = {
        numero_control: parseInt(formData.numero_control, 10), // ⚠ aseguramos que sea entero
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
      alert("✅ Beca registrada exitosamente");
      navigate("/becas");
    } catch (error) {
      console.error("❌ Error registrando beca:", error);
      alert("Error al registrar la beca.");
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando estudiantes...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Registrar Beca</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Buscar estudiante */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Buscar estudiante</label>
          <input
            type="text"
            placeholder="Nombre, apellido o número de control..."
            value={searchEstudiante}
            onChange={handleSearchChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Select de estudiantes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Estudiante</label>
          <select
            name="numero_control"
            value={formData.numero_control}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Selecciona un estudiante</option>
            {displayedEstudiantes.map((est) => (
              <option key={est.numero_control} value={est.numero_control}>
                {est.nombre} {est.apellido} — {est.numero_control}
              </option>
            ))}
          </select>
          {searchEstudiante.trim() === "" && estudiantes.length > 10 && (
            <p className="text-sm text-gray-500 mt-1">
              Mostrando los primeros 10 estudiantes. Usa el buscador para ver más.
            </p>
          )}
        </div>

        {/* Tipo de Beca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Beca</label>
          <select
            name="tipo_beca"
            value={formData.tipo_beca}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="alimenticia">Alimenticia</option>
            <option value="transporte">Transporte</option>
            <option value="residencia">Residencia</option>
            <option value="academica">Académica</option>
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Solicitud</label>
            <input
              type="date"
              name="fecha_solicitud"
              value={formData.fecha_solicitud}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Aprobación</label>
            <input
              type="date"
              name="fecha_aprobacion"
              value={formData.fecha_aprobacion}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Entrega</label>
            <input
              type="date"
              name="fecha_entrega"
              value={formData.fecha_entrega}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha de Fin</label>
            <input
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Estatus */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Estatus</label>
          <select
            name="estatus"
            value={formData.estatus}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="entregada">Entregada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea
            name="observaciones"
            value={formData.observaciones}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          ></textarea>
        </div>

        {/* Notas Internas */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Notas Internas</label>
          <textarea
            name="notas_internas"
            value={formData.notas_internas}
            onChange={handleChange}
            rows="2"
            className="mt-1 block w-full px-3 py-2 border rounded-lg"
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/becas")}
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
