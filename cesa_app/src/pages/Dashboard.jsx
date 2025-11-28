import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js"; // Asegúrate que esta ruta es correcta
import SummaryCard from "../components/SummaryCard.jsx";
import FinancialSection from "../components/FinancialSection.jsx";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-10">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
    <p className="ml-4 text-gray-600">Calculando balance...</p>
  </div>
);

const Dashboard = () => {
    const navigate = useNavigate();

    // 💾 State
    const [finanzas, setFinanzas] = useState([]);
    const [loading, setLoading] = useState(true);

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
            console.error("❌ Error al obtener registros en Dashboard:", error.message || error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        obtenerRegistros();
    }, [obtenerRegistros]);

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

    // --- Funciones de Navegación Personalizadas ---

    const handleNavigateToFinanzasDetalle = (tipo) => {
        navigate("/financiero", { state: { detalleTipo: tipo } }); 
    };

    const handleNavigateToFinanzas = () => {
        navigate("/financiero");
    };

    // 🚨 Nuevo botón para Backup 🚨
    const handleBackup = () => {
        navigate("/backup");
    };


    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>

                {/* 🔥 Botón nuevo sin modificar la lógica */}
                <button
                    onClick={handleBackup}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Backup
                </button>
            </div>

            {loading && finanzas.length === 0 ? (
                <LoadingSpinner />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 sm:px-0">
                        <SummaryCard
                            title="Próximos Eventos"
                            mainText="Asamblea General - 15 de Oct. 2023"
                            buttonText="Ver más"
                        />
                        
                        <SummaryCard 
                            title="Resumen Financiero" 
                            mainText={`$${balance.toFixed(2)}`} 
                            subText={balance >= 0 ? "Balance actual positivo" : "Balance actual negativo"}
                            buttonText="Ver desglose completo"
                            onButtonClick={handleNavigateToFinanzas} 
                        />
                        
                        <SummaryCard
                            title="Estadísticas de Miembros"
                            mainText="250"
                            subText="Total de Miembros"
                        />
                        <SummaryCard
                            title="Estado de Becas"
                            mainText="12"
                            subText="Becas Activas"
                        />
                        <SummaryCard
                            title="Resumen de Estudiantes"
                            mainText="500"
                            subText="Estudiantes Activos"
                        />
                    </div>

                    <FinancialSection
                        title="Desglose Financiero"
                        amount={`$${balance.toFixed(2)}`}
                        changeText={balance >= 0 ? "Positivo" : "Negativo"}
                        totalIngresos={totalIngresos.toFixed(2)}
                        totalEgresos={totalEgresos.toFixed(2)}
                        onIngresoClick={() => handleNavigateToFinanzasDetalle("Ingreso")}
                        onEgresoClick={() => handleNavigateToFinanzasDetalle("Egreso")}
                    />
                </>
            )}
        </div>
    )
}

export default Dashboard;
