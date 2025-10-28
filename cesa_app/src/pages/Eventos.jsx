import React, { useState, useEffect, useMemo } from "react";
import Swal from "sweetalert2";
import { supabase } from "../supabaseClient.js";
import EventosModal from "../components/EventosModal.jsx";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
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

  useEffect(() => {
    cargarEventos();
  }, []);

  // 🧠 Filtrado por texto y semestre
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      const coincideTexto =
        ev.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        ev.tipo?.toLowerCase().includes(busqueda.toLowerCase());
      const coincideSemestre = ev.semestre === semestreFiltro;
      return coincideTexto && coincideSemestre;
    });
  }, [busqueda, eventos, semestreFiltro]);

  // 🟢 Guardar evento (crear o editar)
  const handleSave = async (evento) => {
    try {
      let resultado;
      
      // Preparar datos sin el id para nuevos eventos
      const datosParaGuardar = {
        nombre: evento.nombre,
        tipo: evento.tipo,
        fecha: evento.fecha,
        hora: evento.hora,
        ubicacion: evento.ubicacion,
        estatus: evento.estatus,
        semestre: evento.semestre
      };

      if (evento.id) {
        // 🔄 Editar evento existente
        resultado = await supabase
          .from("eventos")
          .update(datosParaGuardar)
          .eq("id", evento.id);
      } else {
        // ➕ Crear nuevo evento
        resultado = await supabase
          .from("eventos")
          .insert([datosParaGuardar]);
      }

      if (resultado.error) throw resultado.error;

      Swal.fire("✅ Guardado", "El evento se ha guardado correctamente.", "success");
      setModalAbierto(false);
      setEventoEditando(null);
      await cargarEventos();
    } catch (err) {
      console.error("Error completo:", err);
      Swal.fire("❌ Error al guardar el evento", err.message, "error");
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

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar evento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 w-64"
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
          <p className="mt-4 text-gray-600">Cargando eventos...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-green-100 text-left">
                <th className="p-3 border border-gray-300">Nombre</th>
                <th className="p-3 border border-gray-300">Tipo</th>
                <th className="p-3 border border-gray-300">Fecha</th>
                <th className="p-3 border border-gray-300">Hora</th>
                <th className="p-3 border border-gray-300">Ubicación</th>
                <th className="p-3 border border-gray-300">Estatus</th>
                <th className="p-3 border border-gray-300">Semestre</th>
                <th className="p-3 border border-gray-300 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {eventosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-4 text-center text-gray-500">
                    {eventos.length === 0 
                      ? "No hay eventos registrados. ¡Agrega el primer evento!" 
                      : "No se encontraron eventos con los filtros aplicados"}
                  </td>
                </tr>
              ) : (
                eventosFiltrados.map((ev) => (
                  <tr key={ev.id} className="hover:bg-green-50">
                    <td className="p-3 border border-gray-300">{ev.nombre}</td>
                    <td className="p-3 border border-gray-300">{ev.tipo}</td>
                    <td className="p-3 border border-gray-300">{ev.fecha}</td>
                    <td className="p-3 border border-gray-300">{ev.hora}</td>
                    <td className="p-3 border border-gray-300">{ev.ubicacion}</td>
                    <td className="p-3 border border-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        ev.estatus === 'Activo' ? 'bg-green-100 text-green-800' :
                        ev.estatus === 'Cancelado' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ev.estatus}
                      </span>
                    </td>
                    <td className="p-3 border border-gray-300">Semestre {ev.semestre}</td>
                    <td className="p-3 border border-gray-300 text-center">
                      <button
                        onClick={() => {
                          setEventoEditando(ev);
                          setModalAbierto(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 hover:underline mr-3 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarEvento(ev.id)}
                        className="text-red-600 hover:text-red-800 hover:underline transition-colors"
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
        />
      )}
    </div>
  );
}


