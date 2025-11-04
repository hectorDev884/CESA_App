import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import MiembrosModal from "../components/MiembrosModal";
import InteraccionesModal from "../components/InteraccionesModal";

export default function Miembros() {
const [miembros, setMiembros] = useState([]);
const [interacciones, setInteracciones] = useState([]);
const [busqueda, setBusqueda] = useState("");
const [mostrarVista, setMostrarVista] = useState("miembros"); // "miembros" o "interacciones"
const [modalMiembro, setModalMiembro] = useState({ mostrar: false, miembro: null });
const [modalInteraccion, setModalInteraccion] = useState({ mostrar: false, interaccion: null });

// Cargar datos
useEffect(() => {
fetchMiembros();
fetchInteracciones();
}, []);

async function fetchMiembros() {
const { data, error } = await supabase.from("miembros").select("*").order("id", { ascending: true });
if (error) console.error(error);
else setMiembros(data || []);
}

async function fetchInteracciones() {
const { data, error } = await supabase.from("interacciones").select("*").order("id", { ascending: true });
if (error) console.error(error);
else setInteracciones(data || []);
}

async function eliminarMiembro(id) {
if (!confirm("¿Seguro que quieres eliminar este miembro?")) return;
const { error } = await supabase.from("miembros").delete().eq("id", id);
if (error) console.error(error);
else fetchMiembros();
}

async function eliminarInteraccion(id) {
if (!confirm("¿Seguro que quieres eliminar esta interacción?")) return;
const { error } = await supabase.from("interacciones").delete().eq("id", id);
if (error) console.error(error);
else fetchInteracciones();
}

// Filtrado
const miembrosFiltrados = miembros.filter((m) =>
`${m.nombre} ${m.apellido_paterno} ${m.apellido_materno} ${m.coordinacion}`
.toLowerCase()
.includes(busqueda.toLowerCase())
);

const interaccionesFiltradas = interacciones.filter((i) =>
`${i.tema} ${i.descripcion} ${i.tipo}`
.toLowerCase()
.includes(busqueda.toLowerCase())
);

return ( <div className="p-6"> <h1 className="text-2xl font-bold mb-4 text-center">Gestión de Miembros e Interacciones</h1>

```
  {/* Botones superiores */}
  <div className="flex justify-center gap-4 mb-4">
    <button
      onClick={() => setMostrarVista("miembros")}
      className={`px-4 py-2 rounded-lg ${
        mostrarVista === "miembros" ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
    >
      Miembros
    </button>
    <button
      onClick={() => setMostrarVista("interacciones")}
      className={`px-4 py-2 rounded-lg ${
        mostrarVista === "interacciones" ? "bg-blue-600 text-white" : "bg-gray-200"
      }`}
    >
      Interacciones
    </button>
  </div>

  {/* Barra de búsqueda */}
  <div className="flex justify-between mb-4">
    <input
      type="text"
      placeholder="Buscar..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      className="border p-2 rounded-lg w-1/2"
    />
    {mostrarVista === "miembros" ? (
      <button
        onClick={() => setModalMiembro({ mostrar: true, miembro: null })}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        + Nuevo Miembro
      </button>
    ) : (
      <button
        onClick={() => setModalInteraccion({ mostrar: true, interaccion: null })}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        + Nueva Interacción
      </button>
    )}
  </div>

  {/* Tabla de Miembros */}
  {mostrarVista === "miembros" && (
    <table className="w-full border text-sm text-center">
      <thead className="bg-gray-100">
        <tr>
          <th>NC</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Rol</th>
          <th>Cargo</th>
          <th>Coordinación</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {miembrosFiltrados.map((m) => (
          <tr key={m.id} className="border-b hover:bg-gray-50">
            <td>{m.nc}</td>
            <td>{`${m.nombre} ${m.apellido_paterno} ${m.apellido_materno}`}</td>
            <td>{m.correo}</td>
            <td>{m.rol}</td>
            <td>{m.cargo}</td>
            <td>{m.coordinacion}</td>
            <td>{m.activo ? "Sí" : "No"}</td>
            <td className="space-x-2">
              <button
                onClick={() => setModalMiembro({ mostrar: true, miembro: m })}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarMiembro(m.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* Tabla de Interacciones */}
  {mostrarVista === "interacciones" && (
    <table className="w-full border text-sm text-center">
      <thead className="bg-gray-100">
        <tr>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Tema</th>
          <th>Descripción</th>
          <th>Miembro Responsable</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {interaccionesFiltradas.map((i) => (
          <tr key={i.id} className="border-b hover:bg-gray-50">
            <td>{i.tipo}</td>
            <td>{i.fecha}</td>
            <td>{i.tema}</td>
            <td>{i.descripcion}</td>
            <td>{i.miembro_id}</td>
            <td className="space-x-2">
              <button
                onClick={() => setModalInteraccion({ mostrar: true, interaccion: i })}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => eliminarInteraccion(i.id)}
                className="bg-red-600 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}

  {/* Modales */}
  {modalMiembro.mostrar && (
    <MiembrosModal
      miembro={modalMiembro.miembro}
      onClose={() => {
        setModalMiembro({ mostrar: false, miembro: null });
        fetchMiembros();
      }}
    />
  )}

  {modalInteraccion.mostrar && (
    <InteraccionesModal
      interaccion={modalInteraccion.interaccion}
      onClose={() => {
        setModalInteraccion({ mostrar: false, interaccion: null });
        fetchInteracciones();
      }}
    />
  )}
</div>

);
}
