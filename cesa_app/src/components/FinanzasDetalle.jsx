import React, { useState, useMemo } from "react";
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

// Función auxiliar para formatear fechas en el tooltip/eje X
const formatFecha = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  // Formato: DD/MM/YYYY
  return date.toLocaleDateString('es-MX', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

export default function FinanzasDetalle({ tipo, registros, onClose }) {
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");

  // 1. Optimización: Calcular categorías solo cuando cambian los registros
  const categorias = useMemo(() => {
    // Usamos el tipo actual para las categorías (Ingreso o Egreso)
    const registrosPorTipo = registros.filter((r) => r.tipo === tipo);
    return [...new Set(registrosPorTipo.map((r) => r.categoria))].sort();
  }, [registros, tipo]);

  // 2. Optimización: Aplicar todos los filtros y tipos
  const registrosFiltradosPorTipo = useMemo(() => {
    // Si tipo es Balance, incluimos todos para el cálculo inicial
    const registrosBase = tipo === "Balance" 
        ? registros 
        : registros.filter((r) => r.tipo === tipo);

    return registrosBase.filter((r) => {
        // Filtro de Categoría (solo aplica si no es Balance)
        if (tipo !== "Balance" && filtroCategoria && r.categoria !== filtroCategoria) {
            return false;
        }
        
        // Filtro de Fecha de Inicio
        if (filtroFechaInicio && new Date(r.fecha) < new Date(filtroFechaInicio)) {
            return false;
        }

        // Filtro de Fecha de Fin
        if (filtroFechaFin && new Date(r.fecha) > new Date(filtroFechaFin)) {
            return false;
        }
        return true;
    });
  }, [registros, tipo, filtroCategoria, filtroFechaInicio, filtroFechaFin]);


  // 3. Optimización: Calcular los datos del balance acumulado
  const datosBalance = useMemo(() => {
    // Aseguramos que solo se recalculen cuando los registros filtrados cambien
    return registrosFiltradosPorTipo
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
        .reduce((acc, curr) => {
            // Usamos el formato DD/MM/YYYY en el gráfico
            const fechaFormateada = formatFecha(curr.fecha); 
            const monto = curr.tipo === "Ingreso" ? +curr.monto : -curr.monto;
            
            // Si la fecha actual es la misma que la anterior, sumamos al último saldo
            const ultimoRegistro = acc.length > 0 ? acc[acc.length - 1] : { saldo: 0, fecha: null };
            
            let nuevoSaldo;

            if (ultimoRegistro.fecha === fechaFormateada) {
                // Acumular movimientos del mismo día
                nuevoSaldo = ultimoRegistro.saldo + monto;
                acc[acc.length - 1].saldo = nuevoSaldo; // Reemplazar el último
            } else {
                // Nuevo día
                const saldoAnterior = ultimoRegistro.saldo;
                nuevoSaldo = saldoAnterior + monto;
                acc.push({ fecha: fechaFormateada, saldo: nuevoSaldo });
            }
            return acc;
        }, [])
  }, [registrosFiltradosPorTipo]);


  // Definimos la lista final de registros para la tabla (si no es Balance)
  const registrosParaTabla = tipo !== "Balance" ? registrosFiltradosPorTipo : [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-3xl transition duration-150"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          &times; {/* Usamos &times; para una 'X' más elegante */}
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {tipo === "Ingreso"
            ? "Detalles de Ingresos"
            : tipo === "Egreso"
            ? "Detalles de Egresos"
            : "Balance General Acumulado"}
        </h2>

        {/* 🔸 Filtros (Aplica a Ingreso, Egreso y Balance para las fechas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Selector de Categoría (solo para Ingreso/Egreso) */}
          {(tipo === "Ingreso" || tipo === "Egreso") && (
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
          )}

          <input
            type="date"
            placeholder="Fecha de Inicio"
            value={filtroFechaInicio}
            onChange={(e) => setFiltroFechaInicio(e.target.value)}
            className={`border rounded-lg px-3 py-2 focus:ring-2 ${tipo !== "Balance" ? '' : 'col-span-1 md:col-start-2'} focus:ring-blue-500`}
          />

          <input
            type="date"
            placeholder="Fecha de Fin"
            value={filtroFechaFin}
            onChange={(e) => setFiltroFechaFin(e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 🔸 Tabla de resultados (solo para Ingresos y Egresos) */}
        {(tipo === "Ingreso" || tipo === "Egreso") && (
          <div className="overflow-x-auto max-h-80 overflow-y-auto mb-6 border rounded-lg shadow-inner">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Concepto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Monto
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Categoría
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrosParaTabla.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {r.concepto}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      ${Number(r.monto).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {r.categoria}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      {formatFecha(r.fecha)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {registrosParaTabla.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                No se encontraron registros en el rango de fechas/categoría.
              </p>
            )}
          </div>
        )}

        {/* 🔸 Gráfico del balance general */}
        {tipo === "Balance" && (
          <div className="mt-6 border rounded-lg p-2 shadow-md">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosBalance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                {/* Usamos TickFormatter para un formato de fecha legible */}
                <XAxis dataKey="fecha" tickFormatter={(f) => f.substring(0, 5)} /> 
                <YAxis tickFormatter={(value) => `$${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`} />
                <Tooltip 
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Saldo Acumulado']} 
                    labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="saldo"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  name="Saldo Acumulado"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}