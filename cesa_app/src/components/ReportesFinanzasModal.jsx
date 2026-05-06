import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";

const formatMonto = (v) =>
  `$${Number(v).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const VERDE = "#036942";

function aplicarEstiloEncabezado(ws, rango) {
  const ref = XLSX.utils.decode_range(rango);
  for (let C = ref.s.c; C <= ref.e.c; C++) {
    const celda = XLSX.utils.encode_cell({ r: ref.s.r, c: C });
    if (!ws[celda]) continue;
    ws[celda].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "036942" } },
      alignment: { horizontal: "center" },
    };
  }
}

export default function ReportesFinanzasModal({ registros, onClose }) {
  const [filtroTipo, setFiltroTipo] = useState("Todos");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
  const [filtroFechaFin, setFiltroFechaFin] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [exportando, setExportando] = useState(false);

  useEffect(() => { setFiltroCategoria(""); }, [filtroTipo]);

  const categoriasDisponibles = useMemo(() => {
    const base = filtroTipo === "Todos" ? registros : registros.filter((r) => r.tipo === filtroTipo);
    return [...new Set(base.map((r) => r.categoria).filter(Boolean))].sort();
  }, [registros, filtroTipo]);

  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
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
  }, [registros, filtroTipo, filtroCategoria, filtroFechaInicio, filtroFechaFin, searchInput]);

  const { totalIngresos, totalEgresos, balance } = useMemo(() => {
    const ingresos = registrosFiltrados.filter((r) => r.tipo === "Ingreso").reduce((s, r) => s + Number(r.monto || 0), 0);
    const egresos = registrosFiltrados.filter((r) => r.tipo === "Egreso").reduce((s, r) => s + Number(r.monto || 0), 0);
    return { totalIngresos: ingresos, totalEgresos: egresos, balance: ingresos - egresos };
  }, [registrosFiltrados]);

  const resumenPorCategoria = useMemo(() => {
    const cats = {};
    registrosFiltrados.forEach((r) => {
      const key = `${r.tipo}__${r.categoria || "Sin categoría"}`;
      if (!cats[key]) cats[key] = { tipo: r.tipo, categoria: r.categoria || "Sin categoría", total: 0, cantidad: 0 };
      cats[key].total += Number(r.monto || 0);
      cats[key].cantidad += 1;
    });
    return Object.values(cats).sort((a, b) => b.total - a.total);
  }, [registrosFiltrados]);

  const resumenPorMes = useMemo(() => {
    const meses = {};
    registrosFiltrados.forEach((r) => {
      if (!r.fecha) return;
      const d = new Date(r.fecha);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleDateString("es-MX", { year: "numeric", month: "long" });
      if (!meses[key]) meses[key] = { mes: label, key, ingresos: 0, egresos: 0 };
      if (r.tipo === "Ingreso") meses[key].ingresos += Number(r.monto || 0);
      if (r.tipo === "Egreso") meses[key].egresos += Number(r.monto || 0);
    });
    return Object.values(meses).sort((a, b) => a.key.localeCompare(b.key));
  }, [registrosFiltrados]);

  const hayFiltros = filtroTipo !== "Todos" || filtroCategoria || filtroFechaInicio || filtroFechaFin || searchInput;

  // ── Exportar Excel ─────────────────────────────────────────────────────────

  const exportarExcel = () => {
    setExportando(true);
    try {
      const wb = XLSX.utils.book_new();

      // ── Hoja 1: Movimientos ──
      const filasMov = [
        ["Concepto", "Tipo", "Monto ($)", "Categoría", "Fecha"],
        ...registrosFiltrados.map((r) => [
          r.concepto ?? "",
          r.tipo ?? "",
          Number(r.monto || 0),
          r.categoria ?? "",
          r.fecha ? new Date(r.fecha).toLocaleDateString("es-MX") : "",
        ]),
      ];
      const ws1 = XLSX.utils.aoa_to_sheet(filasMov);
      aplicarEstiloEncabezado(ws1, `A1:E1`);
      ws1["!cols"] = [{ wch: 35 }, { wch: 12 }, { wch: 14 }, { wch: 30 }, { wch: 14 }];
      XLSX.utils.book_append_sheet(wb, ws1, "Movimientos");

      // ── Hoja 2: Por Categoría ──
      const filasCat = [
        ["Tipo", "Categoría", "Cantidad", "Total ($)"],
        ...resumenPorCategoria.map((c) => [c.tipo, c.categoria, c.cantidad, c.total]),
      ];
      const ws2 = XLSX.utils.aoa_to_sheet(filasCat);
      aplicarEstiloEncabezado(ws2, `A1:D1`);
      ws2["!cols"] = [{ wch: 12 }, { wch: 32 }, { wch: 12 }, { wch: 14 }];
      XLSX.utils.book_append_sheet(wb, ws2, "Por Categoría");

      // ── Hoja 3: Por Mes ──
      const filasMes = [
        ["Mes", "Ingresos ($)", "Egresos ($)", "Balance ($)"],
        ...resumenPorMes.map((m) => [m.mes, m.ingresos, m.egresos, m.ingresos - m.egresos]),
      ];
      const ws3 = XLSX.utils.aoa_to_sheet(filasMes);
      aplicarEstiloEncabezado(ws3, `A1:D1`);
      ws3["!cols"] = [{ wch: 20 }, { wch: 16 }, { wch: 16 }, { wch: 16 }];
      XLSX.utils.book_append_sheet(wb, ws3, "Por Mes");

      // ── Hoja 4: Resumen ──
      const periodo =
        filtroFechaInicio || filtroFechaFin
          ? `${filtroFechaInicio || "—"} al ${filtroFechaFin || "—"}`
          : "Sin restricción de fechas";

      const filasRes = [
        ["REPORTE FINANCIERO"],
        [],
        ["Período", periodo],
        ["Tipo filtrado", filtroTipo],
        ["Categoría filtrada", filtroCategoria || "Todas"],
        ["Búsqueda", searchInput || "—"],
        [],
        ["TOTALES", ""],
        ["Total de registros", registrosFiltrados.length],
        ["Total Ingresos", totalIngresos],
        ["Total Egresos", totalEgresos],
        ["Balance", balance],
      ];
      const ws4 = XLSX.utils.aoa_to_sheet(filasRes);
      ws4["!cols"] = [{ wch: 24 }, { wch: 30 }];
      if (ws4["A1"]) ws4["A1"].s = { font: { bold: true, sz: 14, color: { rgb: "036942" } } };
      XLSX.utils.book_append_sheet(wb, ws4, "Resumen");

      // Nombre del archivo con timestamp
      const ts = new Date().toLocaleDateString("es-MX").replace(/\//g, "-");
      XLSX.writeFile(wb, `reporte_finanzas_${ts}.xlsx`);
    } catch (err) {
      console.error("Error al exportar:", err);
      alert("Error al generar el archivo Excel.");
    } finally {
      setExportando(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-6 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl relative">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reporte Financiero</h2>
            <p className="text-sm text-gray-500 mt-0.5">Aplica filtros y exporta los resultados a Excel</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-3xl leading-none transition"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* ── Filtros ── */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Filtros</h3>
              {hayFiltros && (
                <button
                  onClick={() => { setFiltroTipo("Todos"); setFiltroCategoria(""); setFiltroFechaInicio(""); setFiltroFechaFin(""); setSearchInput(""); }}
                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  ✕ Limpiar
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Tipo</label>
                <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500">
                  <option value="Todos">Todos</option>
                  <option value="Ingreso">Ingreso</option>
                  <option value="Egreso">Egreso</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Categoría</label>
                <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-green-500">
                  <option value="">Todas</option>
                  {categoriasDisponibles.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Desde</label>
                <input type="date" value={filtroFechaInicio} onChange={(e) => setFiltroFechaInicio(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                <input type="date" value={filtroFechaFin} onChange={(e) => setFiltroFechaFin(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Buscar</label>
                <input type="text" placeholder="Concepto..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </div>

          {/* ── Tarjetas de totales filtrados ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-xs text-green-700 font-semibold uppercase tracking-wide mb-1">Ingresos</p>
              <p className="text-xl font-bold text-green-700">{formatMonto(totalIngresos)}</p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
              <p className="text-xs text-red-700 font-semibold uppercase tracking-wide mb-1">Egresos</p>
              <p className="text-xl font-bold text-red-700">{formatMonto(totalEgresos)}</p>
            </div>
            <div className={`${balance >= 0 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"} border rounded-xl p-4 text-center`}>
              <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${balance >= 0 ? "text-blue-700" : "text-red-700"}`}>Balance</p>
              <p className={`text-xl font-bold ${balance >= 0 ? "text-blue-700" : "text-red-700"}`}>{formatMonto(balance)}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">Registros</p>
              <p className="text-xl font-bold text-gray-800">{registrosFiltrados.length}</p>
            </div>
          </div>

          {/* ── Tabla de movimientos ── */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Movimientos ({registrosFiltrados.length})
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="overflow-x-auto max-h-72 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Concepto</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Monto</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Categoría</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {registrosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400 italic">
                          Sin registros para los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      registrosFiltrados.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2 text-sm text-gray-900">{r.concepto}</td>
                          <td className={`px-4 py-2 text-sm font-semibold ${r.tipo === "Ingreso" ? "text-green-700" : "text-red-600"}`}>
                            {r.tipo}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">{formatMonto(r.monto)}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{r.categoria}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">
                            {r.fecha ? new Date(r.fecha).toLocaleDateString("es-MX") : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Resumen por categoría ── */}
          {resumenPorCategoria.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Resumen por Categoría</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-52 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Tipo</th>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Categoría</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Cantidad</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {resumenPorCategoria.map((c, i) => (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className={`px-4 py-2 text-sm font-semibold ${c.tipo === "Ingreso" ? "text-green-700" : "text-red-600"}`}>
                            {c.tipo}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800">{c.categoria}</td>
                          <td className="px-4 py-2 text-sm text-gray-600 text-right">{c.cantidad}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">{formatMonto(c.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── Resumen por mes ── */}
          {resumenPorMes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Resumen por Mes</h3>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="overflow-x-auto max-h-52 overflow-y-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Mes</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Ingresos</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Egresos</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600 uppercase">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {resumenPorMes.map((m, i) => {
                        const bal = m.ingresos - m.egresos;
                        return (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-800 capitalize">{m.mes}</td>
                            <td className="px-4 py-2 text-sm text-green-700 font-medium text-right">{formatMonto(m.ingresos)}</td>
                            <td className="px-4 py-2 text-sm text-red-600 font-medium text-right">{formatMonto(m.egresos)}</td>
                            <td className={`px-4 py-2 text-sm font-bold text-right ${bal >= 0 ? "text-blue-700" : "text-red-700"}`}>
                              {formatMonto(bal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-400">
            El archivo Excel incluirá 4 hojas: Movimientos, Por Categoría, Por Mes y Resumen.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm font-medium"
            >
              Cerrar
            </button>
            <button
              onClick={exportarExcel}
              disabled={exportando || registrosFiltrados.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#036942] text-white text-sm font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {exportando ? "Generando..." : "Exportar Excel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
