import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { getReporteBecas, exportarBecasExcel } from "../services/api_becas_estudiante";

const COLORES_PIE = [
  "#036942", "#fbbf24", "#3b82f6", "#ef4444",
  "#8b5cf6", "#f97316", "#ec4899", "#14b8a6",
  "#a3e635", "#fb923c",
];

const ESTATUS_COLORES = { aprobadas: "#036942", pendientes: "#fbbf24" };

const CAMPOS_DISPONIBLES = [
  { key: "id", label: "ID" },
  { key: "numero_control", label: "Número Control" },
  { key: "estudiante", label: "Estudiante" },
  { key: "carrera", label: "Carrera" },
  { key: "semestre", label: "Semestre" },
  { key: "email", label: "Email" },
  { key: "telefono", label: "Teléfono" },
  { key: "tipo_beca", label: "Tipo Beca" },
  { key: "fecha_solicitud", label: "Fecha Solicitud" },
  { key: "fecha_aprobacion", label: "Fecha Aprobación" },
  { key: "fecha_entrega", label: "Fecha Entrega" },
  { key: "fecha_fin", label: "Fecha Fin" },
  { key: "estatus", label: "Estatus" },
];

function StatCard({ titulo, valor, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className={`text-5xl font-bold ${color}`}>{valor ?? "—"}</p>
      <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-wide">{titulo}</p>
    </div>
  );
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.04) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function Reportes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [camposSeleccionados, setCamposSeleccionados] = useState(
    CAMPOS_DISPONIBLES.map((c) => c.key)
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const result = await getReporteBecas();
      setData(result);
    } catch (err) {
      console.error("Error cargando reportes:", err);
      setError("No se pudieron cargar los datos. Verifica la conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    setExportLoading(true);
    setMostrarSelector(false);
    try {
      await exportarBecasExcel(camposSeleccionados);
    } catch {
      alert("Error al exportar el reporte.");
    } finally {
      setExportLoading(false);
    }
  }

  function toggleCampo(key) {
    setCamposSeleccionados((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function toggleTodos() {
    if (camposSeleccionados.length === CAMPOS_DISPONIBLES.length) {
      setCamposSeleccionados([]);
    } else {
      setCamposSeleccionados(CAMPOS_DISPONIBLES.map((c) => c.key));
    }
  }

  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center gap-3 text-gray-600 text-lg">
        <svg className="animate-spin h-6 w-6 text-[#036942]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Cargando reportes...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-600">
        <p>{error}</p>
        <button onClick={fetchData} className="mt-4 px-4 py-2 bg-[#036942] text-white rounded-lg hover:bg-green-700 transition">
          Reintentar
        </button>
      </div>
    );
  }

  const { totales, por_carrera = [], por_tipo = [], por_semestre = [], por_semestre_academico = [] } = data || {};

  const estatusData = [
    { name: "Aprobadas", value: totales?.aprobadas || 0 },
    { name: "Pendientes", value: totales?.pendientes || 0 },
  ];

  const carreraData = por_carrera.map((c) => ({
    ...c,
    carrera: c.carrera || "Sin carrera",
  }));

  const tipoData = por_tipo.map((t) => ({
    ...t,
    tipo_beca: t.tipo_beca || "Sin tipo",
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Reportes de Becas</h1>
        <div className="relative mt-4 sm:mt-0">
          <button
            onClick={() => setMostrarSelector(!mostrarSelector)}
            disabled={exportLoading}
            className="bg-[#036942] text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50 flex items-center gap-2 hover:cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {exportLoading ? "Exportando..." : "Exportar Excel"}
          </button>

          {mostrarSelector && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="p-3 border-b border-gray-100">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:cursor-pointer">
                  <input
                    type="checkbox"
                    checked={camposSeleccionados.length === CAMPOS_DISPONIBLES.length}
                    onChange={toggleTodos}
                    className="rounded accent-[#036942] hover:cursor-pointer"
                  />
                  {camposSeleccionados.length === CAMPOS_DISPONIBLES.length
                    ? "Deseleccionar todos"
                    : "Seleccionar todos"}
                </label>
              </div>
              <div className="p-3 max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                {CAMPOS_DISPONIBLES.map((campo) => (
                  <label
                    key={campo.key}
                    className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-gray-900 hover:cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={camposSeleccionados.includes(campo.key)}
                      onChange={() => toggleCampo(campo.key)}
                      className="rounded accent-[#036942] hover:cursor-pointer"
                    />
                    {campo.label}
                  </label>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100">
                <button
                  onClick={handleExport}
                  disabled={camposSeleccionados.length === 0 || exportLoading}
                  className="w-full bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50 text-sm font-medium hover:cursor-pointer"
                >
                  Exportar ({camposSeleccionados.length} campos)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard titulo="Total Becas" valor={totales?.total} color="text-[#036942]" />
        <StatCard titulo="Aprobadas" valor={totales?.aprobadas} color="text-green-500" />
        <StatCard titulo="Pendientes" valor={totales?.pendientes} color="text-yellow-500" />
      </div>

      {/* Gráfica por carrera (ancho completo) */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Becas por Carrera</h2>
        {carreraData.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Sin datos</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(250, carreraData.length * 50)}>
            <BarChart data={carreraData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="carrera" width={200} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="aprobadas" name="Aprobadas" fill="#036942" stackId="a" />
              <Bar dataKey="pendientes" name="Pendientes" fill="#fbbf24" stackId="a" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Becas por semestre académico A/B */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          Becas por Semestre Académico
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Últimos 6 semestres · A&nbsp;=&nbsp;Ene–Jun &nbsp;|&nbsp; B&nbsp;=&nbsp;Jul–Dic · ordenados por fecha de solicitud
        </p>
        {por_semestre_academico.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Sin datos</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={por_semestre_academico}
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="semestre" tick={{ fontSize: 13, fontWeight: 600 }} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, "Becas"]} />
              <Bar dataKey="total" name="Becas" radius={[4, 4, 0, 0]}>
                {por_semestre_academico.map((entry, i) => {
                  const isLast = i === por_semestre_academico.length - 1;
                  const isA = entry.semestre.endsWith('-A');
                  return (
                    <Cell
                      key={i}
                      fill={isLast ? "#036942" : isA ? "#34d399" : "#fbbf24"}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        {/* Leyenda de colores */}
        <div className="flex gap-5 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#34d399]"></span>Semestre A (Ene–Jun)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#fbbf24]"></span>Semestre B (Jul–Dic)</span>
          <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded-sm bg-[#036942]"></span>Semestre actual</span>
        </div>
      </div>

      {/* Fila de pie charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Por tipo de beca */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Por Tipo de Beca</h2>
          {tipoData.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tipoData}
                  dataKey="total"
                  nameKey="tipo_beca"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {tipoData.map((_, i) => (
                    <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Por estatus */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Por Estatus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                labelLine={false}
                label={renderCustomLabel}
              >
                <Cell fill={ESTATUS_COLORES.aprobadas} />
                <Cell fill={ESTATUS_COLORES.pendientes} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
