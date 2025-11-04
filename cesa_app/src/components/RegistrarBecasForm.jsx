import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getEstudiantes, createBeca } from "../services/api_becas_estudiante.js";

export default function RegistrarBecaForm() {
  const navigate = useNavigate();

  // 1. Estados
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(false); // Cambiado a false ya que la carga es condicional
  const [searchEstudiante, setSearchEstudiante] = useState(""); // Término de búsqueda del input
  const [searchQuery, setSearchQuery] = useState(""); // Término para activar la búsqueda real (debounce o button click)
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

  // 2. Función de Carga de Estudiantes (incluye la búsqueda)
  // Nota: Dado que la API de estudiantes ahora devuelve paginación,
  // pediremos solo la primera página para el select.
  const fetchEstudiantes = useCallback(async (term) => {
    if (!term || term.trim() === "") {
        setEstudiantes([]);
        return;
    }
    
    setLoading(true);
    try {
      // 💡 Usamos el parámetro 'search' para filtrar en el backend (DRF)
      const query = `search=${encodeURIComponent(term)}`;
      const response = await getEstudiantes(query);
      
      // DRF devuelve {count, next, previous, results}. Necesitamos 'results'.
      setEstudiantes(response.results || response); // Usa results si está disponible
    } catch (err) {
      console.error("Error cargando estudiantes para la búsqueda:", err);
      setEstudiantes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Efecto para ejecutar la búsqueda cada vez que searchQuery cambia
  useEffect(() => {
    // Si el query es demasiado corto, no hacemos la llamada
    if (searchQuery.length >= 2) { 
        fetchEstudiantes(searchQuery);
    } else {
        setEstudiantes([]);
    }
  }, [searchQuery, fetchEstudiantes]);


  // 🖋️ Manejo de inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🔍 Manejo del input de búsqueda (actualiza el input, no el query real)
  const handleSearchInputChange = (e) => {
    setSearchEstudiante(e.target.value);
  };
  
  // 🔍 Función que activa la búsqueda al hacer clic en el botón
  const handleSearchClick = () => {
    setSearchQuery(searchEstudiante);
  };

  // 📨 Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ⚠️ Validación crucial: debe haber un estudiante seleccionado
    if (!formData.numero_control) {
        // Usamos un modal o un mensaje dentro del formulario en lugar de alert
        console.error("Debe seleccionar un estudiante para registrar la beca.");
        return; 
    }
    
    try {
      const newBeca = {
        numero_control: parseInt(formData.numero_control, 10), 
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
      // alert("✅ Beca registrada exitosamente"); // Cambiar a un mensaje de notificación en UI
      navigate("/becas");
    } catch (error) {
      console.error("❌ Error registrando beca:", error);
      // alert("Error al registrar la beca."); // Cambiar a un mensaje de notificación en UI
    }
  };


  return (
    <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow-xl border border-gray-100">
      <h2 className="text-3xl font-extrabold mb-6 text-green-800 text-center">Registro de Nueva Beca</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* BUSCADOR DE ESTUDIANTE (Con integración a DRF Search) */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <label className="block text-sm font-bold text-gray-700 mb-2">Buscar Estudiante</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Escribe 2+ letras para buscar por nombre o número de control..."
              value={searchEstudiante}
              onChange={handleSearchInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150"
            />
            <button
                type="button"
                onClick={handleSearchClick}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150"
                disabled={loading}
            >
                {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* Select de estudiantes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Seleccionar Estudiante</label>
          <select
            name="numero_control"
            value={formData.numero_control}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150"
          >
            <option value="">
                {searchQuery.length < 2 
                    ? "Busca un estudiante arriba (mín. 2 caracteres)" 
                    : estudiantes.length === 0 && !loading 
                        ? "No se encontraron resultados."
                        : "Selecciona un estudiante..."}
            </option>
            {estudiantes.map((est) => (
              <option 
                key={est.numero_control} 
                value={est.numero_control}
                className="py-1"
              >
                {est.nombre} {est.apellido} — No. Control: {est.numero_control}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Beca */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Beca</label>
          <select
            name="tipo_beca"
            value={formData.tipo_beca}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150"
          >
            <option value="alimenticia">Alimenticia</option>
            <option value="transporte">Transporte</option>
            <option value="residencia">Residencia</option>
            <option value="academica">Académica</option>
          </select>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Campo de fecha individual (ejemplo) */}
          {Object.entries({
            fecha_solicitud: "Solicitud",
            fecha_aprobacion: "Aprobación",
            fecha_entrega: "Entrega",
            fecha_fin: "Fin",
          }).map(([name, label]) => (
            <div key={name}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type="date"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={name === 'fecha_solicitud'}
                className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Estatus */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Estatus</label>
          <select
            name="estatus"
            value={formData.estatus}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150"
          >
            <option value="pendiente">Pendiente</option>
            <option value="aprobada">Aprobada</option>
            <option value="entregada">Entregada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>

        {/* Observaciones y Notas Internas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Observaciones</label>
                <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                ></textarea>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Notas Internas</label>
                <textarea
                    name="notas_internas"
                    value={formData.notas_internas}
                    onChange={handleChange}
                    rows="3"
                    className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                ></textarea>
            </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 pt-4 border-t pt-6 border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/becas")}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition duration-150"
            disabled={!formData.numero_control}
          >
            Registrar Beca
          </button>
        </div>
      </form>
    </div>
  );
}
