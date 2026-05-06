import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import FinanzasModal from "../components/FinanzasModal";
import FinanzasDetalle from "../components/FinanzasDetalle";
import SummaryCard from "../components/SummaryCard";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import ReportesFinanzasModal from "../components/ReportesFinanzasModal";

const COLORES_PIE = [
  "#16a34a", "#2563eb", "#d97706", "#dc2626", "#7c3aed",
  "#0891b2", "#be123c", "#15803d", "#c2410c", "#1d4ed8",
];

const formatMonto = (v) =>
  `$${Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500" />
    <p className="ml-4 text-gray-600">Cargando datos...</p>
  </div>
);

export default function Financieros() {
  const location = useLocation();
  const detalleTipoInicial = location.state?.detalleTipo || null;

  const [finanzas, setFinanzas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  const [detalleTipo, setDetalleTipo] = useState(detalleTipoInicial);
  const [showReportes, setShowReportes] = useState(false);

  // ── Datos ──────────────────────────────────────────────────────────────────

  const obtenerRegistros = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("finanzas")
        .select("*")
        .order("fecha", { ascending: false });
      if (error) throw error;
      setFinanzas(data);
    } catch (err) {
      console.error("Error al obtener registros:", err.message || err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSave = useCallback(
    async (registro) => {
      try {
        if (modoEdicion && registroActual) {
          const dataToUpdate = { ...registro };
          delete dataToUpdate.id;
          const { error } = await supabase
            .from("finanzas")
            .update(dataToUpdate)
            .eq("id", registroActual.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("finanzas").insert([registro]);
          if (error) throw error;
        }
        await obtenerRegistros();
      } catch (err) {
        console.error("Error al guardar:", err.message || err);
        alert(`Error al guardar el registro: ${err.message || err}`);
      } finally {
        setShowModal(false);
        setModoEdicion(false);
        setRegistroActual(null);
      }
    },
    [modoEdicion, registroActual, obtenerRegistros]
  );

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("¿Estás seguro que deseas eliminar este registro? Esta acción es irreversible.")) return;
      try {
        const { error } = await supabase.from("finanzas").delete().eq("id", id);
        if (error) throw error;
        await obtenerRegistros();
      } catch (err) {
        console.error("Error al eliminar:", err.message || err);
        alert(`Error al eliminar: ${err.message || err}`);
      }
    },
    [obtenerRegistros]
  );

  useEffect(() => { obtenerRegistros(); }, [obtenerRegistros]);

  useEffect(() => {
    if (detalleTipoInicial) {
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [detalleTipoInicial, location.pathname]);

  // Resetear categoría cuando cambia tipo
  useEffect(() => { setFiltroCategoria(""); }, [filtroTipo]);

  // ── Cálculos ───────────────────────────────────────────────────────────────

  const { totalIngresos, totalEgresos, balance } = useMemo(() => {
    const ingresos = finanzas.filter((r) => r.tipo === "Ingreso").reduce((s, r) => s + Number(r.monto || 0), 0);
    const egresos = finanzas.filter((r) => r.tipo === "Egreso").reduce((s, r) => s + Number(r.monto || 0), 0);
    return { totalIngresos: ingresos, totalEgresos: egresos, balance: ingresos - egresos };
  }, [finanzas]);

  const categoriasDisponibles = useMemo(() => {
    const base = filtroTipo === "Todos" ? finanzas : finanzas.filter((r) => r.tipo === filtroTipo);
    return [...new Set(base.map((r) => r.categoria).filter(Boolean))].sort();
  }, [finanzas, filtroTipo]);

  const registrosFiltrados = useMemo(() => {
    return finanzas.filter((r) => {
      if (filtroTipo !== "Todos" && r.tipo !== filtroTipo) return false;
      if (filtroCategoria && r.categoria !== filtroCategoria) return false;
      if (filtroFechaInicio && new Date(r.fecha) < new Date(filtroFechaInicio)) return false;
      if (filtroFechaFin && new Date(r.fecha) > new Date(filtroFechaFin)) return false;
      if (searchInput) {
        const s = searchInput.toLowerCase();
        return (
          r.concepto?.toLowerCase().includes(s) ||
          r.categoria?.toLowerCase().includes(s) ||
          r.tipo?.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [finanzas, filtroTipo, filtroCategoria, filtroFechaInicio, filtroFechaFin, searchInput]);

  const hayFiltrosActivos =
    filtroTipo !== "Todos" || filtroCategoria || filtroFechaInicio || filtroFechaFin || searchInput;

  const limpiarFiltros = () => {
    setFiltroTipo("Todos");
    setFiltroCategoria("");
    setFiltroFechaInicio("");
    setFiltroFechaFin("");
    setSearchInput("");
  };

  // ── Datos para gráficas (basadas en registros filtrados) ───────────────────

  const datosBarChart = useMemo(() => {
    const meses = {};
    registrosFiltrados.forEach((r) => {
      if (!r.fecha) return;
      const d = new Date(r.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("es-MX", { year: "numeric", month: "short" });
      if (!meses[key]) meses[key] = { mes: label, key, ingresos: 0, egresos: 0 };
      if (r.tipo === "Ingreso") meses[key].ingresos += Number(r.monto || 0);
      if (r.tipo === "Egreso") meses[key].egresos += Number(r.monto || 0);
    });
    return Object.values(meses).sort((a, b) => a.key.localeCompare(b.key));
  }, [registrosFiltrados]);

  const datosPieChart = useMemo(() => {
    const cats = {};
    registrosFiltrados.forEach((r) => {
      const cat = r.categoria || "Sin categoría";
      cats[cat] = (cats[cat] || 0) + Number(r.monto || 0);
    });
    return Object.entries(cats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [registrosFiltrados]);

  const datosLineChart = useMemo(() => {
    const sorted = [...registrosFiltrados].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    let saldo = 0;
    const puntos = {};
    sorted.forEach((r) => {
      if (!r.fecha) return;
      const key = r.fecha.substring(0, 10);
      const label = new Date(r.fecha).toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" });
      saldo += r.tipo === "Ingreso" ? +r.monto : -r.monto;
      puntos[key] = { fecha: label, saldo };
    });
    return Object.values(puntos);
  }, [registrosFiltrados]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-0">
            Gestión Financiera
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowReportes(true)}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-5 py-3 rounded-xl shadow-sm hover:bg-gray-50 transition duration-200 text-base font-semibold"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#036942]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Reportes
            </button>
            <button
              onClick={() => { setModoEdicion(false); setRegistroActual(null); setShowModal(true); }}
              className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 text-base font-semibold"
            >
              ➕ Nuevo Registro
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Ingresos Totales"
            mainText={formatMonto(totalIngresos)}
            subText="Suma total de entradas de dinero"
            color="green"
            onButtonClick={() => setDetalleTipo("Ingreso")}
          />
          <SummaryCard
            title="Egresos Totales"
            mainText={formatMonto(totalEgresos)}
            subText="Suma total de salidas de dinero"
            color="red"
            onButtonClick={() => setDetalleTipo("Egreso")}
          />
          <SummaryCard
            title="Balance General"
            mainText={formatMonto(balance)}
            subText={balance >= 0 ? "Estado Financiero Positivo" : "Estado Financiero Negativo"}
            color={balance >= 0 ? "blue" : "red"}
            onButtonClick={() => setDetalleTipo("Balance")}
          />
        </div>

        {/* ── Filtros ── */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Filtros</h2>
            {hayFiltrosActivos && (
              <button
                onClick={limpiarFiltros}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition"
              >
                ✕ Limpiar filtros
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="Todos">Todos</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 bg-white"
              >
                <option value="">Todas</option>
                {categoriasDisponibles.map((c, i) => (
                  <option key={i} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
              <input
                type="text"
                placeholder="Concepto, categoría..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* ── Gráficas ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BarChart — movimientos por mes */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Movimientos por Mes</h2>
            {datosBarChart.length === 0 ? (
              <p className="text-center text-gray-400 py-16 text-sm">Sin datos para el período seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={datosBarChart} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(v, name) => [
                      formatMonto(v),
                      name === "ingresos" ? "Ingresos" : "Egresos",
                    ]}
                  />
                  <Legend formatter={(v) => (v === "ingresos" ? "Ingresos" : "Egresos")} />
                  <Bar dataKey="ingresos" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="egresos" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* PieChart — distribución por categoría */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Distribución por Categoría</h2>
            {datosPieChart.length === 0 ? (
              <p className="text-center text-gray-400 py-16 text-sm">Sin datos para el período seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={datosPieChart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    label={({ name, percent }) =>
                      `${name.length > 13 ? name.substring(0, 13) + "…" : name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {datosPieChart.map((_, i) => (
                      <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatMonto(v)} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* LineChart — balance acumulado (ancho completo) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 lg:col-span-2">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Balance Acumulado</h2>
            {datosLineChart.length === 0 ? (
              <p className="text-center text-gray-400 py-12 text-sm">Sin datos para el período seleccionado.</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={datosLineChart} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11 }} />
                  <YAxis
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11 }}
                  />
                  <Tooltip formatter={(v) => [formatMonto(v), "Saldo Acumulado"]} />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={false}
                    name="Saldo Acumulado"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Concepto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && finanzas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition duration-100">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{f.concepto}</td>
                    <td className={`px-6 py-4 text-sm font-semibold ${f.tipo === "Ingreso" ? "text-green-700" : "text-red-600"}`}>
                      {f.tipo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{formatMonto(f.monto)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{f.categoria}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {f.fecha ? new Date(f.fecha).toLocaleDateString("es-MX") : "N/A"}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => { setModoEdicion(true); setRegistroActual({ ...f }); setShowModal(true); }}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 transition duration-150"
                        title="Editar registro"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1 transition duration-150"
                        title="Eliminar registro"
                      >
                        ❌ Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 italic text-lg">
                    {hayFiltrosActivos
                      ? "No se encontraron resultados con los filtros aplicados."
                      : "No hay registros financieros para mostrar."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-200">
            Mostrando {registrosFiltrados.length} de {finanzas.length} registros totales.
          </div>
        </div>

        {/* Modal Detalle */}
        {detalleTipo && (
          <FinanzasDetalle
            registros={finanzas}
            tipo={detalleTipo}
            onClose={() => setDetalleTipo(null)}
          />
        )}

        {/* Modal Reportes */}
        {showReportes && (
          <ReportesFinanzasModal
            registros={finanzas}
            onClose={() => setShowReportes(false)}
          />
        )}

        {/* Modal Agregar / Editar */}
        {showModal && (
          <FinanzasModal
            onClose={() => setShowModal(false)}
            onSave={handleSave}
            registro={registroActual}
            modoEdicion={modoEdicion}
          />
        )}
      </div>
    </div>
  );
}
