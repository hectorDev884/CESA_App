import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function FinanzasDetalle({ tipo, registros, onClose }) {
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  const categorias = [
    ...new Set(
      registros
        .filter((r) => r.tipo === tipo)
        .map((r) => r.categoria)
    ),
  ];

  // 🔹 Filtro según categoría y fechas
  const filtrados = registros.filter((r) => {
    if (tipo && r.tipo !== tipo) return false;
    if (filtroCategoria && r.categoria !== filtroCategoria) return false;
    if (filtroFechaInicio && new Date(r.fecha) < new Date(filtroFechaInicio))
      return false;
    if (filtroFechaFin && new Date(r.fecha) > new Date(filtroFechaFin))
      return false;
    return true;
  });

  // 🔹 Datos para el gráfico del balance general
  const datosBalance = registros
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .reduce((acc, curr) => {
      const fecha = curr.fecha;
      const monto = curr.tipo === "Ingreso" ? +curr.monto : -curr.monto;
      const anterior = acc.length > 0 ? acc[acc.length - 1].saldo : 0;
      acc.push({ fecha, saldo: anterior + monto });
      return acc;
    }, []);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {tipo === "Ingreso"
            ? "Detalles de Ingresos"
            : tipo === "Egreso"
            ? "Detalles de Egresos"
            : "Balance General"}
        </h2>

        {/* 🔸 Filtros para Ingresos y Egresos */}
        {(tipo === "Ingreso" || tipo === "Egreso") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <select
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c, i) => (
                <option key={i} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={filtroFechaInicio}
              onChange={(e) => setFiltroFechaInicio(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              value={filtroFechaFin}
              onChange={(e) => setFiltroFechaFin(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>
        )}

        {/* 🔸 Tabla de resultados */}
        {(tipo === "Ingreso" || tipo === "Egreso") && (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Monto
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtrados.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {r.concepto}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      ${r.monto}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {r.categoria}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {r.fecha}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtrados.length === 0 && (
              <p className="text-center text-gray-500 mt-4">
                No se encontraron registros.
              </p>
            )}
          </div>
        )}

        {/* 🔸 Gráfico del balance general */}
        {tipo === "Balance" && (
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosBalance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
