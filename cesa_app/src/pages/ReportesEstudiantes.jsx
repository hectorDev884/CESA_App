import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line,
} from "recharts";
import { getReporteEstudiantes, exportarEstudiantesExcel } from "../services/api_becas_estudiante";

const COLORES_PIE = [
  "#036942", "#fbbf24", "#3b82f6", "#ef4444",
  "#8b5cf6", "#f97316", "#ec4899", "#14b8a6",
  "#a3e635", "#fb923c",
];

const MESES = ["", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

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

function StatCard({ titulo, valor, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      <p className={`text-5xl font-bold ${color}`}>{valor ?? "—"}</p>
      <p className="text-gray-500 mt-2 text-sm font-medium uppercase tracking-wide">{titulo}</p>
    </div>
  );
}

export default function ReportesEstudiantes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCarrera, setSelectedCarrera] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const result = await getReporteEstudiantes();
      setData(result);
    } catch (err) {
      console.error("Error cargando reporte de estudiantes:", err);
      setError("No se pudieron cargar los datos. Verifica la conexión.");
    } finally {
      setLoading(false);
    }
  }

  async function handleExport() {
    setExportLoading(true);
    try {
      await exportarEstudiantesExcel();
    } catch (err) {
      alert("Error al exportar el reporte.");
    } finally {
      setExportLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 flex justify-center items-center gap-3 text-gray-600 text-lg">
        <svg className="animate-spin h-6 w-6 text-[#036942]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        Cargando datos...
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

  const { totales = {}, por_carrera = [], por_semestre = [], carrera_x_semestre = [], por_mes_registro = [] } = data || {};

  const carreras = [...new Set(carrera_x_semestre.map((c) => c.carrera))].sort();
  const semestres = [...new Set(carrera_x_semestre.map((c) => String(c.semestre)))].sort((a, b) => Number(a) - Number(b));

  const filteredPivot = carrera_x_semestre.filter(
    (c) =>
      (!selectedCarrera || c.carrera === selectedCarrera) &&
      (!selectedSemestre || String(c.semestre) === selectedSemestre)
  );

  const mesData = por_mes_registro.map((m) => ({
    label: `${MESES[m.mes] || m.mes} ${m.anio}`,
    total: m.total,
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cubo de Estudiantes</h1>
          <p className="text-sm text-gray-500 mt-1">Análisis multidimensional del catálogo de estudiantes</p>
        </div>
        <button
          onClick={handleExport}
          disabled={exportLoading}
          className="mt-4 sm:mt-0 bg-[#036942] text-white px-5 py-2 rounded-lg hover:bg-green-700 transition duration-150 disabled:opacity-50 flex items-center gap-2 hover:cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {exportLoading ? "Exportando..." : "Exportar Excel"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard titulo="Total Estudiantes" valor={totales?.total} color="text-[#036942]" />
        <StatCard titulo="Carreras" valor={por_carrera.length} color="text-blue-600" />
        <StatCard titulo="Semestres" valor={por_semestre.length} color="text-purple-600" />
      </div>

      {/* Fila 1: Por Carrera + Por Semestre */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Estudiantes por Carrera</h2>
          {por_carrera.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(250, por_carrera.length * 40)}>
              <BarChart data={por_carrera} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="carrera" width={200} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="total" name="Estudiantes" fill="#036942" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Estudiantes por Semestre</h2>
          {por_semestre.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Sin datos</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={por_semestre}
                  dataKey="total"
                  nameKey="semestre"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  labelLine={false}
                  label={renderCustomLabel}
                >
                  {por_semestre.map((_, i) => (
                    <Cell key={i} fill={COLORES_PIE[i % COLORES_PIE.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, "Estudiantes"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Registro mensual */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Estudiantes Registrados por Mes</h2>
        {mesData.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Sin datos de registro</p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={mesData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, "Estudiantes"]} />
              <Line type="monotone" dataKey="total" name="Registros" stroke="#036942" strokeWidth={2} dot={{ fill: "#036942", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Tabla pivote: Carrera x Semestre */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tabla Pivote: Carrera × Semestre
        </h2>
        <p className="text-xs text-gray-400 mb-4">
          Cruce dimensional — cantidad de estudiantes por carrera y semestre
        </p>
        <div className="flex flex-wrap gap-3 mb-4">
          <select
            value={selectedCarrera}
            onChange={(e) => setSelectedCarrera(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todas las carreras</option>
            {carreras.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            value={selectedSemestre}
            onChange={(e) => setSelectedSemestre(e.target.value)}
            className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los semestres</option>
            {semestres.map((s) => (
              <option key={s} value={s}>Semestre {s}</option>
            ))}
          </select>
          {(selectedCarrera || selectedSemestre) && (
            <button
              onClick={() => { setSelectedCarrera(""); setSelectedSemestre(""); }}
              className="text-sm text-gray-600 hover:text-red-600 underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
        {filteredPivot.length === 0 ? (
          <p className="text-gray-400 text-center py-8">Sin datos para los filtros seleccionados</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Carrera</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Semestre</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700">Estudiantes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPivot.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-gray-900">{row.carrera || "Sin carrera"}</td>
                    <td className="px-4 py-2 text-[#036942] font-medium">{row.semestre}</td>
                    <td className="px-4 py-2 text-right text-gray-700">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
