import { useState, useEffect } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import EditarMiembroModal from "../components/EditarMiembroModal.jsx";
import InteraccionModal from "../components/InteraccionModal.jsx";
import { supabase } from "../supabaseClient.js";

function Miembros() {
  const [miembros, setMiembros] = useState([]);
  const [interacciones, setInteracciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState("miembros");
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalInteraccion, setMostrarModalInteraccion] = useState(false);

  // 🔹 Obtener miembros desde Supabase
  const fetchMiembros = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("Miembros")
      .select("*")
      .order("miembro_id", { ascending: true });

    if (error) {
      console.error("Error al obtener miembros:", error.message);
    } else {
      setMiembros(data);
    }
    setLoading(false);
  };

  // 🔹 Obtener interacciones desde Supabase
  const fetchInteracciones = async () => {
    let { data, error } = await supabase
      .from("Interacciones")
      .select("*")
      .order("interaccion_id", { ascending: true });

    if (error) console.error("Error al obtener interacciones:", error.message);
    else setInteracciones(data);
  };

  useEffect(() => {
    fetchMiembros();
    fetchInteracciones();
  }, []);

  // 🔹 Agregar o editar miembro
  const handleGuardarMiembro = async (nuevoMiembro) => {
    try {
      if (nuevoMiembro.miembro_id) {
        // Actualizar miembro existente
        const { error } = await supabase
          .from("Miembros")
          .update({
            nombre: nuevoMiembro.nombre,
            cargo: nuevoMiembro.cargo,
            telefono: nuevoMiembro.telefono,
            correo: nuevoMiembro.correo,
          })
          .eq("miembro_id", nuevoMiembro.miembro_id);

        if (error) throw error;
      } else {
        // Agregar nuevo miembro
        const { error } = await supabase.from("Miembros").insert([
          {
            nombre: nuevoMiembro.nombre,
            cargo: nuevoMiembro.cargo,
            telefono: nuevoMiembro.telefono,
            correo: nuevoMiembro.correo,
          },
        ]);

        if (error) throw error;
      }

      setMostrarModal(false);
      fetchMiembros();
    } catch (error) {
      console.error("Error al guardar miembro:", error.message);
    }
  };

  // 🔹 Eliminar miembro
  const handleEliminarMiembro = async (id) => {
    if (confirm("¿Seguro que deseas eliminar este miembro?")) {
      const { error } = await supabase
        .from("Miembros")
        .delete()
        .eq("miembro_id", id);

      if (error) console.error("Error al eliminar:", error.message);
      else fetchMiembros();
    }
  };

  // 🔹 Registrar interacción
  const handleGuardarInteraccion = async (interaccion) => {
    try {
      const { error } = await supabase.from("Interacciones").insert([
        {
          miembro_id: interaccion.miembro_id,
          descripcion: interaccion.descripcion,
          fecha: interaccion.fecha,
        },
      ]);

      if (error) throw error;

      setMostrarModalInteraccion(false);
      fetchInteracciones();
    } catch (error) {
      console.error("Error al guardar interacción:", error.message);
    }
  };

  const miembrosFiltrados = miembros.filter((m) =>
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Miembros</h1>

      {/* Botones de vista */}
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => setVistaActiva("miembros")}
          className={`px-4 py-2 rounded ${
            vistaActiva === "miembros"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Miembros
        </button>
        <button
          onClick={() => setVistaActiva("interacciones")}
          className={`px-4 py-2 rounded ${
            vistaActiva === "interacciones"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Interacciones
        </button>
      </div>

      {/* Vista de Miembros */}
      {vistaActiva === "miembros" && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Buscar miembro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="border p-2 rounded-lg w-1/3"
            />
            <button
              onClick={() => {
                setMiembroSeleccionado(null);
                setMostrarModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + Agregar Miembro
            </button>
          </div>

          {loading ? (
            <p>Cargando miembros...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {miembrosFiltrados.map((miembro) => (
                <SummaryCard
                  key={miembro.miembro_id}
                  miembro={miembro}
                  onEditar={() => {
                    setMiembroSeleccionado(miembro);
                    setMostrarModal(true);
                  }}
                  onEliminar={() => handleEliminarMiembro(miembro.miembro_id)}
                  onInteraccion={() => {
                    setMiembroSeleccionado(miembro);
                    setMostrarModalInteraccion(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vista de Interacciones */}
      {vistaActiva === "interacciones" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Historial de Interacciones</h2>
          <ul className="space-y-2">
            {interacciones.map((i) => (
              <li
                key={i.interaccion_id}
                className="border p-2 rounded-lg shadow-sm"
              >
                <strong>ID Miembro:</strong> {i.miembro_id} <br />
                <strong>Descripción:</strong> {i.descripcion} <br />
                <strong>Fecha:</strong> {i.fecha}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Modales */}
      {mostrarModal && (
        <EditarMiembroModal
          miembro={miembroSeleccionado}
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardarMiembro}
        />
      )}

      {mostrarModalInteraccion && (
        <InteraccionModal
          miembro={miembroSeleccionado}
          onClose={() => setMostrarModalInteraccion(false)}
          onSave={handleGuardarInteraccion}
        />
      )}
    </div>
  );
}

export default Miembros;
