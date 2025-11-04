import React from "react";

const FinancialSection = ({
    title = "Desglose Financiero",
    amount = "$15,000",
    changeText = "Estado",
    totalIngresos = "0.00", // ⬅️ Nuevo: Monto de Ingresos
    totalEgresos = "0.00",  // ⬅️ Nuevo: Monto de Egresos
    onIngresoClick,         // ⬅️ Nuevo: Handler para Ingresos
    onEgresoClick,          // ⬅️ Nuevo: Handler para Egresos
}) => {
    // Definimos las categorías con sus datos y acciones reales
    const financialCategories = [
        {
            name: "Ingresos",
            amount: totalIngresos,
            color: "text-green-600",
            onClick: onIngresoClick, // Aplica la función de navegación
        },
        {
            name: "Egresos",
            amount: totalEgresos,
            color: "text-red-600",
            onClick: onEgresoClick,   // Aplica la función de navegación
        },
        // Categorías estáticas o sin datos de BD por ahora
        { name: "Eventos", amount: "N/A", color: "text-gray-600" },
        { name: "Becas", amount: "N/A", color: "text-gray-600" },
        { name: "Otros", amount: "N/A", color: "text-gray-600" },
    ];

    return (
        <div className="mt-8 px-4 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

                <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-gray-900">{amount}</span>
                    <span className={`ml-2 text-sm font-medium ${amount.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>{changeText}</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {financialCategories.map((cat, i) => (
                        <div
                            key={i}
                            className={`text-center p-4 border border-gray-200 rounded-lg transition-shadow duration-150 ${
                                cat.onClick ? "hover:shadow-md cursor-pointer" : ""
                            }`}
                            onClick={cat.onClick} // Usamos la función de click
                        >
                            <h3 className="font-medium text-gray-900">{cat.name}</h3>
                            <p className={`mt-1 text-lg font-bold ${cat.color}`}>
                                {cat.name === 'Ingresos' || cat.name === 'Egresos' ? `$${cat.amount}` : cat.amount}
                            </p>
                            {/* Mostrar indicación de acción solo si hay una función de click */}
                            {cat.onClick && (
                                <p className="text-xs text-blue-500 mt-1">Ver detalles &rarr;</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FinancialSection;