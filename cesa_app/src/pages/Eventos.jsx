import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient.js";
import EventosModal from "../components/EventosModal.jsx";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [miembros, setMiembros] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [semestreFiltro, setSemestreFiltro] = useState("A");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [cargando, setCargando] = useState(false);

  // 🔹 Detectar semestre actual al cargar
  useEffect(() => {
    const mes = new Date().getMonth() + 1;
    const semestreActual = mes >= 1 && mes <= 6 ? "A" : "B";
    setSemestreFiltro(semestreActual);
  }, []);

  // 🟢 Cargar eventos desde Supabase
  const cargarEventos = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("fecha", { ascending: true });

    if (error) {
      console.error("Error cargando eventos:", error);
      Swal.fire("Error", "No se pudieron cargar los eventos", "error");
    } else {
      setEventos(data || []);
    }
    setCargando(false);
  };

  const cargarMiembros = async () => {
    const { data, error } = await supabase.from("Miembros").select("*");
    if (error) {
      console.error("Error cargando miembros:", error);
    } else {
      setMiembros(data || []);
    }
  };

  useEffect(() => {
    cargarEventos();
    cargarMiembros();
  }, []);

  // 🧠 Filtrado por texto y semestre
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      const coincideTexto =
        ev.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        ev.tipo?.toLowerCase().includes(busqueda.toLowerCase()) ||
        ev.ubicacion?.toLowerCase().includes(busqueda.toLowerCase());
      const coincideSemestre = ev.semestre === semestreFiltro;
      return coincideTexto && coincideSemestre;
    });
  }, [busqueda, eventos, semestreFiltro]);

  // 📊 CÁLCULO DE TOTALES (NUEVO)
  const totalAlumnosGeneral = useMemo(() => {
    return eventosFiltrados.reduce((acc, ev) => acc + (Number(ev.alumnos_inscritos) || 0), 0);
  }, [eventosFiltrados]);

  // 🟢 Guardar evento (crear o editar)
  const handleSave = async (evento) => {
    // Validaciones de seguridad
    if (!evento.nombre?.trim() || !evento.fecha) {
      return Swal.fire("Campos obligatorios", "El nombre y la fecha son necesarios.", "warning");
    }

    if (!evento.miembro_id) {
      return Swal.fire("Campo obligatorio", "Selecciona un miembro para el evento.", "warning");
    }

    if (parseInt(evento.alumnos_inscritos) < 0) {
      return Swal.fire("Valor inválido", "El número de alumnos no puede ser negativo.", "warning");
    }

    try {
      let resultado;
      
      const datosParaGuardar = {
        nombre: evento.nombre,
        tipo: evento.tipo,
        fecha: evento.fecha,
        hora: evento.hora,
        ubicacion: evento.ubicacion,
        miembro_id: evento.miembro_id || null,
        estatus: evento.estatus,
        semestre: evento.semestre,
        alumnos_inscritos: parseInt(evento.alumnos_inscritos) || 0 // 👈 Campo nuevo
      };

      if (evento.id) {
        resultado = await supabase
          .from("eventos")
          .update(datosParaGuardar)
          .eq("id", evento.id);
      } else {
        resultado = await supabase
          .from("eventos")
          .insert([datosParaGuardar]);
      }

      if (resultado.error) throw resultado.error;

      Swal.fire("✅ Guardado", "El evento se ha actualizado correctamente.", "success");
      setModalAbierto(false);
      setEventoEditando(null);
      await cargarEventos();
    } catch (err) {
      console.error("Error al guardar:", err);
      Swal.fire("❌ Error", err.message, "error");
    }
  };

  // 🗑️ Eliminar evento
  const eliminarEvento = async (id) => {
    const confirmacion = await Swal.fire({
      title: "¿Eliminar evento?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmacion.isConfirmed) {
      const { error } = await supabase.from("eventos").delete().eq("id", id);
      if (error) {
        Swal.fire("Error", "No se pudo eliminar el evento", "error");
      } else {
        Swal.fire("Eliminado", "Evento eliminado con éxito", "success");
        cargarEventos();
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-green-700">Gestión de Eventos</h1>

      {/* 📊 PANEL DE ESTADÍSTICAS (NUEVO) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-l-4 border-green-500 p-4 shadow-md rounded-r-lg">
          <p className="text-sm text-gray-600 uppercase font-bold">Total Alumnos Participantes</p>
          <p className="text-3xl font-black text-green-700">{totalAlumnosGeneral}</p>
        </div>
        <div className="bg-white border-l-4 border-blue-500 p-4 shadow-md rounded-r-lg">
          <p className="text-sm text-gray-600 uppercase font-bold">Eventos Filtrados</p>
          <p className="text-3xl font-black text-blue-700">{eventosFiltrados.length}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, tipo o ubicación..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 w-80"
        />

        <select
          value={semestreFiltro}
          onChange={(e) => setSemestreFiltro(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500"
        >
          <option value="A">Semestre A</option>
          <option value="B">Semestre B</option>
        </select>

        <button
          onClick={() => {
            setEventoEditando(null);
            setModalAbierto(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          + Agregar Evento
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-sm">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-3 border">Nombre</th>
                <th className="p-3 border">Tipo</th>
                <th className="p-3 border">Fecha</th>
                <th className="p-3 border">Ubicación</th>
                <th className="p-3 border">Miembro</th>
                <th className="p-3 border">Alumnos</th> {/* 👈 Nueva columna */}
                <th className="p-3 border">Estatus</th>
                <th className="p-3 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">No se encontraron eventos</td>
                </tr>
              ) : (
                eventosFiltrados.map((ev) => (
                  <tr key={ev.id} className="hover:bg-green-50 transition-colors">
                    <td className="p-3 border font-medium">{ev.nombre}</td>
                    <td className="p-3 border">{ev.tipo}</td>
                    <td className="p-3 border">{ev.fecha}</td>
                    <td className="p-3 border">{ev.ubicacion}</td>
                    <td className="p-3 border">{(() => {
                        const miembro = miembros.find((m) => m.numero_control === ev.miembro_id);
                        return miembro ? `${miembro.nombre} ${miembro.apellido}` : ev.miembro_id || "-";
                      })()}</td>
                    <td className="p-3 border font-bold text-green-700">{ev.alumnos_inscritos || 0}</td>
                    <td className="p-3 border">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        ev.estatus === 'Activo' ? 'bg-green-100 text-green-800' :
                        ev.estatus === 'Cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ev.estatus}
                      </span>
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => {
                          setEventoEditando(ev);
                          setModalAbierto(true);
                        }}
                        className="text-blue-600 hover:underline mr-3"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarEvento(ev.id)}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalAbierto && (
        <EventosModal
          onClose={() => setModalAbierto(false)}
          onSave={handleSave}
          eventoData={eventoEditando}
          eventos={eventos}
          miembros={miembros}
        />
      )}
    </div>
  );
}