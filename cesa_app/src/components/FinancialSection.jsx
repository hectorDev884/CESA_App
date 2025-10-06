import React from "react";

const FinancialSection = ({
  title = "Desglose Financiero",
  amount = "$15,000",
  changeText = "Este Mes +5%",
  categories = ["Ingresos", "Gastos", "Eventos", "Becas", "Otros"],
}) => {
  return (
    <div className="mt-8 px-4 sm:px-0">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

        <div className="flex items-baseline mb-6">
          <span className="text-3xl font-bold text-gray-900">{amount}</span>
          <span className="ml-2 text-sm text-green-600 font-medium">{changeText}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="text-center p-4 border border-gray-200 rounded-lg"
            >
              <h3 className="font-medium text-gray-900">{cat}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialSection;
