import React, { useState, useEffect, useMemo, useCallback } from "react";
// 1. Importar useLocation para leer el estado de la navegación
import { useLocation } from "react-router-dom"; 
import { supabase } from "../lib/supabase";
import FinanzasModal from "../components/FinanzasModal";
import FinanzasDetalle from "../components/FinanzasDetalle";
import SummaryCard from "../components/SummaryCard";

// Componente de Spinner para la carga
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
    <p className="ml-4 text-gray-600">Cargando datos...</p>
  </div>
);

export default function Financieros() {
  // Obtiene la ubicación y el estado de la navegación
  const location = useLocation(); 
  const detalleTipoInicial = location.state?.detalleTipo || null;

  // 💾 State
  const [finanzas, setFinanzas] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado de Búsqueda para el filtro instantáneo
  const [searchInput, setSearchInput] = useState(""); 
  
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  // 2. Inicializar el estado de detalleTipo con el valor que viene de la navegación
  const [detalleTipo, setDetalleTipo] = useState(detalleTipoInicial); 

  // --- Funciones de Datos (Supabase) ---

  const obtenerRegistros = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("finanzas")
        .select("*")
        .order("fecha", { ascending: false });

      if (error) throw error; 
      setFinanzas(data);
    } catch (error) {
      console.error("❌ Error al obtener registros:", error.message || error);
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
          // ➕ Insertar
          const { error } = await supabase.from("finanzas").insert([registro]);
          if (error) throw error;
        }
        await obtenerRegistros();
      } catch (error) {
        console.error("❌ Error al guardar registro:", error.message || error);
        alert(`Error al guardar el registro: ${error.message || error}`);
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
      } catch (error) {
        console.error("❌ Error al eliminar registro:", error.message || error);
        alert(`Error al eliminar el registro: ${error.message || error}`);
      }
    },
    [obtenerRegistros]
  );

  // --- Funciones de Interfaz ---

  const handleAdd = () => {
    setModoEdicion(false);
    setRegistroActual(null); 
    setShowModal(true);
  };

  const handleEdit = (registro) => {
    setModoEdicion(true);
    setRegistroActual({ ...registro });
    setShowModal(true);
  };

  const handleOpenDetalle = (tipo) => {
      setDetalleTipo(tipo);
  };

  const handleCloseDetalle = () => {
      setDetalleTipo(null);
  };


  // --- Efectos y Cálculos ---

  useEffect(() => {
    obtenerRegistros();
  }, [obtenerRegistros]);
  
  // 3. useEffect para limpiar el estado de navegación después de usarlo
  useEffect(() => {
    if (detalleTipoInicial) {
      // Limpia el estado de la URL sin recargar
      window.history.replaceState({}, document.title, location.pathname); 
    }
  }, [detalleTipoInicial, location.pathname]);


  // 🔍 Filtro Instantáneo: Filtra cada vez que 'searchInput' cambia
  const registrosFiltrados = useMemo(() => {
    if (!searchInput) return finanzas;
    const lowerCaseSearch = searchInput.toLowerCase();

    return finanzas.filter(
      (r) =>
        r.concepto?.toLowerCase().includes(lowerCaseSearch) ||
        r.categoria?.toLowerCase().includes(lowerCaseSearch) ||
        r.tipo?.toLowerCase().includes(lowerCaseSearch)
    );
  }, [finanzas, searchInput]);

  // 💰 Cálculos de resumen
  const { totalIngresos, totalEgresos, balance } = useMemo(() => {
    const ingresos = finanzas
      .filter((r) => r.tipo === "Ingreso")
      .reduce((acc, cur) => acc + Number(cur.monto || 0), 0);

    const egresos = finanzas
      .filter((r) => r.tipo === "Egreso")
      .reduce((acc, cur) => acc + Number(cur.monto || 0), 0);

    return {
      totalIngresos: ingresos,
      totalEgresos: egresos,
      balance: ingresos - egresos,
    };
  }, [finanzas]);

  // --- Renderizado ---

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header con título y botón de "Nuevo Registro" */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 border-b border-gray-200">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4 sm:mb-0">
            Gestión Financiera
          </h1>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out text-lg font-semibold"
          >
            ➕ Nuevo Registro
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            title="Ingresos Totales"
            mainText={`$${totalIngresos.toFixed(2)}`}
            subText="Suma total de entradas de dinero"
            color="green" 
            onButtonClick={() => handleOpenDetalle("Ingreso")}
          />
          <SummaryCard
            title="Egresos Totales"
            mainText={`$${totalEgresos.toFixed(2)}`}
            subText="Suma total de salidas de dinero"
            color="red" 
            onButtonClick={() => handleOpenDetalle("Egreso")}
          />
          <SummaryCard
            title="Balance General"
            mainText={`$${balance.toFixed(2)}`}
            subText={balance >= 0 ? "Estado Financiero Positivo" : "Estado Financiero Negativo"}
            color={balance >= 0 ? "blue" : "red"} 
            onButtonClick={() => handleOpenDetalle("Balance")}
          />
        </div>

        {/* Barra de búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por concepto, tipo o categoría..."
            className="w-full px-5 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-base"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Tabla de registros */}
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
                  <tr key={f.id} className="hover:bg-gray-50 transition duration-100 ease-in-out">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{f.concepto}</td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        f.tipo === "Ingreso" ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {f.tipo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">${Number(f.monto).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{f.categoria}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {f.fecha ? new Date(f.fecha).toLocaleDateString("es-MX") : "N/A"}
                    </td>
                    <td className="px-6 py-4 flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(f)}
                        className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1 transition duration-150 ease-in-out"
                        title="Editar registro"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(f.id)}
                        className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1 transition duration-150 ease-in-out"
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
                      {searchInput 
                          ? `No se encontraron resultados para "${searchInput}".` 
                          : "No hay registros financieros para mostrar."
                      }
                    </td>
                  </tr>
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 bg-gray-50 text-sm text-gray-600 border-t border-gray-200">
            Mostrando {registrosFiltrados.length} de {finanzas.length} registros totales.
          </div>
        </div>

        {/* Modal Detalle (Balance / Ingreso / Egreso) */}
        {detalleTipo && (
          <FinanzasDetalle
            registros={finanzas} 
            tipo={detalleTipo}
            onClose={handleCloseDetalle}
          />
        )}

        {/* Modal de agregar/editar */}
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