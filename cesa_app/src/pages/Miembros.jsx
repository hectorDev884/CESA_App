import React, { useEffect, useState } from "react";
import MiembrosModal from "../components/MiembrosModal";
import { supabase } from "../supabaseClient"; // Importamos el cliente de Supabase

export default function Miembros() {
  // Datos locales (ahora cargados desde la BD)
  const [miembros, setMiembros] = useState([]);
  const [interacciones, setInteracciones] = useState([]); // AHORA CARGA DESDE BD

  // ESTADO PARA LOS NÚMEROS DE CONTROL DESDE SUPABASE
  const [numerosControlEstudiantes, setNumerosControlEstudiantes] = useState([]);

  // 🔑 NUEVO ESTADO: Almacena los datos completos de los estudiantes para el autocompletado en el modal
  const [datosCompletosEstudiantes, setDatosCompletosEstudiantes] = useState([]);


  // Control de vistas (miembros o interacciones)
  const [vista, setVista] = useState("miembros"); // "miembros" | "interacciones"

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // "agregarMiembro" | "editarMiembro" | "buscarMiembro" | "agregarInteraccion" | "editarInteraccion"
  const [modalInitial, setModalInitial] = useState(null); // datos para editar / precargar

  // ID incremental para interacciones (local) - Ya no se necesita para la BD, pero lo mantenemos si hay lógica local.
  const [nextInteraccionId, setNextInteraccionId] = useState(1);

  // Estado de filtro (cuando se busca un miembro se muestran solo esos resultados)
  const [miembrosFiltrados, setMiembrosFiltrados] = useState(null);
  const [interaccionesFiltradas, setInteraccionesFiltradas] = useState(null);

  // 🟢 FUNCIÓN BASE: CARGAR MIEMBROS DE SUPABASE 🟢
  const fetchMiembros = async () => {
    const { data: miembrosData, error: miembrosError } = await supabase
      .from('Miembros')
      .select('*')
      .order('fecha_registro', { ascending: false });

    if (miembrosError) {
      console.error("Error al obtener Miembros:", miembrosError);
      alert("Error al cargar la lista de miembros.");
    } else if (miembrosData) {
      setMiembros(miembrosData);
      setMiembrosFiltrados(null); // Limpiar filtros al recargar todos
    }
  };

  // 🆕 FUNCIÓN BASE: CARGAR INTERACCIONES DE SUPABASE 🆕
  const fetchInteracciones = async () => {
    const { data: interaccionesData, error: interaccionesError } = await supabase
      .from('Interacciones')
      .select('*')
      .order('fecha', { ascending: false });

    if (interaccionesError) {
      console.error("Error al obtener Interacciones:", interaccionesError);
      alert("Error al cargar la lista de interacciones.");
    } else if (interaccionesData) {
      setInteracciones(interaccionesData);
      setInteraccionesFiltradas(null); // Limpiar filtros al recargar todos
    }
  };


  // 🔄 EFECTO PARA EXTRAER DATOS INICIALES DE SUPABASE
  useEffect(() => {
    async function fetchDatosEstudiantes() {
      // Nota: Esta llamada debería idealmente apuntar a una tabla de estudiantes,
      // pero por ahora usamos Miembros como fuente de NC para validación.
      const { data, error } = await supabase
        .from('Miembros')
        .select('*');

      if (error) {
        console.error("Error al obtener datos de Miembros:", error);
      } else if (data) {
        setDatosCompletosEstudiantes(data);
        const ncList = data.map(item => item.numero_control);
        setNumerosControlEstudiantes(ncList);
      }
    }
    fetchDatosEstudiantes();
    fetchMiembros();
    fetchInteracciones(); // 🆕 Cargar interacciones al inicio
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Nota: El useEffect para datos de ejemplo de interacciones ha sido eliminado, 
  // ya que ahora se cargan desde fetchInteracciones().

  // 🔑 Miembros CRUD (ya migrado a Supabase)
  // ----------------------------------------------------
  const agregarMiembro = async (miembroData) => {
    if (!miembroData.numero_control || !numerosControlEstudiantes.includes(miembroData.numero_control) || miembros.find((m) => m.numero_control === miembroData.numero_control)) {
      alert("Validación fallida al agregar miembro.");
      return;
    }

    const nuevoMiembro = { ...miembroData, fecha_registro: new Date().toISOString() };

    const { error } = await supabase.from('Miembros').insert([nuevoMiembro]);

    if (error) {
      console.error("Error al agregar miembro:", error);
      alert(`Error al agregar miembro: ${error.message}`);
    } else {
      await fetchMiembros();
      setModalOpen(false);
      alert("Miembro agregado con éxito!");
    }
  };

  const editarMiembro = async (numero_control, cambios) => {
    const { error } = await supabase
      .from('Miembros')
      .update(cambios)
      .eq('numero_control', numero_control);

    if (error) {
      console.error("Error al editar miembro:", error);
      alert(`Error al editar miembro: ${error.message}`);
    } else {
      await fetchMiembros();
      setModalOpen(false);
      alert("Miembro editado con éxito!");
    }
  };

  const eliminarMiembro = async (numero_control) => {
    if (!window.confirm("¿Seguro que deseas eliminar este miembro?")) return;

    // 1. Eliminar interacciones relacionadas (Buena práctica en cascada)
    const { error: interaccionError } = await supabase
      .from('Interacciones')
      .delete()
      .eq('miembro_id', numero_control);

    if (interaccionError) {
      console.error("Advertencia: No se pudieron eliminar las interacciones:", interaccionError);
      // No alertamos para no detener la eliminación del miembro, pero registramos el error.
    }

    // 2. Eliminación del miembro
    const { error: miembroError } = await supabase
      .from('Miembros')
      .delete()
      .eq('numero_control', numero_control);

    if (miembroError) {
      console.error("Error al eliminar miembro:", miembroError);
      alert(`Error al eliminar miembro: ${miembroError.message}`);
    } else {
      await fetchMiembros(); // Recargar lista de miembros
      await fetchInteracciones(); // Recargar lista de interacciones
      setMiembrosFiltrados(null);
      alert("Miembro y sus interacciones eliminados con éxito!");
    }
  };

  const buscarMiembro = async (numero_control) => {
    const { data, error } = await supabase
      .from('Miembros')
      .select('*')
      .eq('numero_control', numero_control);

    if (error) {
      console.error("Error al buscar miembro en Supabase:", error);
      alert("Error al buscar el miembro.");
      setModalOpen(false);
      return;
    }

    if (data && data.length > 0) {
      setMiembrosFiltrados(data);
      setVista("miembros");
      setModalOpen(false);
    } else {
      alert(`No se encontró el miembro con el número de control: ${numero_control}.`);
      setMiembrosFiltrados(null);
      setModalOpen(false);
    }
  };

  const mostrarTodosMiembros = () => {
    fetchMiembros();
  };

  // 🔑 Interacciones CRUD (MIGRADO A SUPABASE)
  // ----------------------------------------------------

  // 1. CREAR: agregarInteraccion
  const agregarInteraccion = async (interaccionData) => {
    // Validaciones
    if (!interaccionData.miembro_id || !miembros.some((m) => m.numero_control === interaccionData.miembro_id)) {
      alert("Selecciona un miembro existente.");
      return;
    }

    // El ID lo genera Supabase. No necesitamos nextInteraccionId.
    const nuevaInteraccion = {
      ...interaccionData,
      // created_at lo gestiona Supabase
    };

    // Inserción en Supabase
    const { error } = await supabase
      .from('Interacciones')
      .insert([nuevaInteraccion]);

    if (error) {
      console.error("Error al agregar interacción:", error);
      alert(`Error al agregar interacción: ${error.message}`);
    } else {
      // Éxito: recargar la lista de interacciones desde la BD
      await fetchInteracciones();
      setModalOpen(false);
      alert("Interacción agregada con éxito!");
    }
  };

  // 2. EDITAR: editarInteraccion
  const editarInteraccion = async (id, cambios) => {
    // Actualización en Supabase
    const { error } = await supabase
      .from('Interacciones')
      .update(cambios)
      .eq('id', id); // Usamos el ID de la BD

    if (error) {
      console.error("Error al editar interacción:", error);
      alert(`Error al editar interacción: ${error.message}`);
    } else {
      // Éxito: recargar la lista de interacciones desde la BD
      await fetchInteracciones();
      setModalOpen(false);
      alert("Interacción editada con éxito!");
    }
  };

  // 3. ELIMINAR: eliminarInteraccion
  const eliminarInteraccion = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta interacción?")) return;

    // Eliminación en Supabase
    const { error } = await supabase
      .from('Interacciones')
      .delete()
      .eq('id', id); // Usamos el ID de la BD

    if (error) {
      console.error("Error al eliminar interacción:", error);
      alert(`Error al eliminar interacción: ${error.message}`);
    } else {
      // Éxito: actualizar el estado local para reflejar la eliminación
      setInteracciones((prev) => prev.filter((i) => i.id !== id));
      setInteraccionesFiltradas(null);
      alert("Interacción eliminada con éxito!");
    }
  };


  // ------- Helpers para abrir modal (sin cambios) -------
  const abrirAgregarMiembro = () => {
    setModalTipo("agregarMiembro");
    setModalInitial(null);
    setModalOpen(true);
  };
  const abrirEditarMiembro = (miembro) => {
    setModalTipo("editarMiembro");
    setModalInitial(miembro);
    setModalOpen(true);
  };
  const abrirBuscarMiembro = () => {
    setModalTipo("buscarMiembro");
    setModalInitial(null);
    setModalOpen(true);
  };

  const abrirAgregarInteraccion = () => {
    setModalTipo("agregarInteraccion");
    setModalInitial(null);
    setModalOpen(true);
  };
  const abrirEditarInteraccion = (interaccion) => {
    setModalTipo("editarInteraccion");
    setModalInitial(interaccion);
    setModalOpen(true);
  };

  // Data que efectivamente se muestra en tablas (considera filtros)
  const miembrosAMostrar = miembrosFiltrados ?? miembros;
  const interaccionesAMostrar = interaccionesFiltradas ?? interacciones;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">
        Gestión de Miembros e Interacciones
      </h1>

      {/* Paneles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Panel Miembros */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-center mb-4">Miembros</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={abrirAgregarMiembro}
              className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Agregar Miembro
            </button>
            <button
              onClick={() => {
                setVista("miembros");
                mostrarTodosMiembros();
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Mostrar Miembros
            </button>
            <button
              onClick={abrirBuscarMiembro}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Buscar Miembro
            </button>
          </div>
        </div>

        {/* Panel Interacciones */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-xl font-semibold text-center mb-4">Interacciones</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setVista("interacciones");
                fetchInteracciones(); // Asegura que los datos estén frescos
              }}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Ver Interacciones
            </button>
            <button
              onClick={() => {
                abrirAgregarInteraccion();
                setVista("interacciones");
              }}
              className="bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Agregar Interacción
            </button>
          </div>
        </div>
      </div>

      {/* Tabla (se reemplaza según vista) */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {vista === "miembros" ? (
          <>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Lista de Miembros</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Número Control
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Apellido
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Carrera
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Semestre
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Teléfono
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {miembrosAMostrar.map((m) => (
                    <tr key={m.numero_control} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {m.numero_control}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{m.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{m.apellido}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{m.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{m.carrera}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{m.semestre}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{m.telefono}</td>
                      <td className="px-4 py-3 flex justify-center gap-3">
                        <button
                          onClick={() => abrirEditarMiembro(m)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => eliminarMiembro(m.numero_control)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                  {miembrosAMostrar.length === 0 && (
                    <tr>
                      <td colSpan="8" className="p-6 text-center text-gray-500">
                        No hay miembros registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Miembros */}
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex justify-end items-center gap-3">
              <button
                onClick={mostrarTodosMiembros}
                className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
              >
                Mostrar Todos
              </button>
              <button
                onClick={() => {
                  setVista("interacciones");
                }}
                className="bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700"
              >
                Ver Interacciones
              </button>
            </div>
          </>
        ) : (
          // VISTA INTERACCIONES
          <>
            <div className="p-4 border-b flex items-center justify-start">
              <h3 className="text-lg font-semibold">Lista de Interacciones</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Miembro (Núm. control)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Tema
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Fecha
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {interaccionesAMostrar.map((i) => (
                    <tr key={i.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{i.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{i.miembro_id}</td>
                      <td className="px-4 py-3 text-sm text-[#036942] font-medium">{i.tipo}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{i.tema}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{i.fecha}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{i.descripcion}</td>
                      <td className="px-4 py-3 flex justify-center gap-3">
                        <button
                          onClick={() => abrirEditarInteraccion(i)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => eliminarInteraccion(i.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                  {interaccionesAMostrar.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-6 text-center text-gray-500">
                        No hay interacciones registradas.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Interacciones */}
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 flex justify-end items-center gap-3">
              <button
                onClick={() => {
                  setVista("miembros");
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Volver a Miembros
              </button>
            </div>
          </>
        )}
      </div>


      {/* Modal (reutilizable) */}
      {modalOpen && (
        <MiembrosModal
          tipoModal={modalTipo}
          initialData={modalInitial}
          onClose={() => setModalOpen(false)}
          onAgregarMiembro={(m) => agregarMiembro(m)}
          onEditarMiembro={(numero_control, cambios) => editarMiembro(numero_control, cambios)}
          onBuscarMiembro={(numero_control) => buscarMiembro(numero_control)}
          onAgregarInteraccion={(i) => agregarInteraccion(i)} // Llama a la versión de Supabase
          onEditarInteraccion={(id, cambios) => editarInteraccion(id, cambios)} // Llama a la versión de Supabase
          miembros={miembros}
          // PASAMOS LA LISTA OBTENIDA DE SUPABASE
          numerosControlPermitidos={numerosControlEstudiantes}
          // 🔑 PASAMOS LOS DATOS COMPLETOS DE ESTUDIANTES
          datosEstudiantes={datosCompletosEstudiantes}
        />
      )}
    </div>
  );
}