import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import MiembrosModal from "../components/MiembrosModal";

function Miembros() {
  const [miembros, setMiembros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [miembroSeleccionado, setMiembroSeleccionado] = useState(null);

  // 🔹 Cargar miembros desde Supabase
  const fetchMiembros = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("Miembros")
      .select("*")
      .order("miembro_id", { ascending: true });

    if (error) console.error("Error al obtener miembros:", error.message);
    else setMiembros(data || []);

    setLoading(false);
  };

  useEffect(() => {
    fetchMiembros();
  }, []);

  // 🔹 Guardar (insertar o actualizar)
  const handleGuardarMiembro = async (miembro) => {
    try {
      if (miembro.miembro_id) {
        // Actualizar
        const { error } = await supabase
          .from("Miembros")
          .update({
            nc: miembro.nc,
            nombre: miembro.nombre,
            apellido_paterno: miembro.apellido_paterno,
            apellido_materno: miembro.apellido_materno,
            correo: miembro.correo,
            cargo: miembro.cargo,
            rol: miembro.rol,
            coordinacion: miembro.coordinacion,
            activo: miembro.activo,
          })
          .eq("miembro_id", miembro.miembro_id);

        if (error) throw error;
      } else {
        // Insertar
        const { error } = await supabase.from("Miembros").insert([
          {
            nc: miembro.nc,
            nombre: miembro.nombre,
            apellido_paterno: miembro.apellido_paterno,
            apellido_materno: miembro.apellido_materno,
            correo: miembro.correo,
            cargo: miembro.cargo,
            rol: miembro.rol,
            coordinacion: miembro.coordinacion,
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
      const { error } = await supabase.from("Miembros").delete().eq("miembro_id", id);
      if (error) console.error("Error al eliminar:", error.message);
      else fetchMiembros();
    }
  };

  const miembrosFiltrados = miembros.filter((m) =>
    m.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Miembros</h1>

      {/* 🔎 Barra de búsqueda y botón agregar */}
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

      {/* 🧾 Tabla de miembros */}
      {loading ? (
        <p>Cargando miembros...</p>
      ) : miembrosFiltrados.length === 0 ? (
        <p>No hay miembros registrados.</p>
      ) : (
        <table className="min-w-full border border-gray-200 bg-white shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">NC</th>
              <th className="p-2 border">Nombre</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Cargo</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {miembrosFiltrados.map((miembro) => (
              <tr key={miembro.miembro_id} className="text-center hover:bg-gray-50">
                <td className="border p-2">{miembro.miembro_id}</td>
                <td className="border p-2">{miembro.nc}</td>
                <td className="border p-2">
                  {miembro.nombre} {miembro.apellido_paterno}
                </td>
                <td className="border p-2">{miembro.correo}</td>
                <td className="border p-2">{miembro.cargo}</td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => {
                      setMiembroSeleccionado(miembro);
                      setMostrarModal(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminarMiembro(miembro.miembro_id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* 🪟 Modal de agregar/editar */}
      {mostrarModal && (
        <MiembrosModal
          onClose={() => setMostrarModal(false)}
          onSave={handleGuardarMiembro}
          miembroData={miembroSeleccionado}
        />
      )}
    </div>
  );
}

export default Miembros;
