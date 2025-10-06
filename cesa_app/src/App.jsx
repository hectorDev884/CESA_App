import React from "react";
import Navigation from "./components/Navigation.jsx";
import SummaryCard from "./components/SummaryCard.jsx";
import FinancialSection from "./components/FinancialSection.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Welcome Message */}
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, Admin!
            </h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 px-4 sm:px-0">
            <SummaryCard
              title="Próximos Eventos"
              mainText="Asamblea General - 15 de Oct. 2023"
              buttonText="Ver más"
            />
            <SummaryCard title="Resumen Financiero" mainText="$15,000" />
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

          {/* Financial Breakdown Section */}
          <FinancialSection
            title="Desglose Financiero"
            amount="$15,000"
            changeText="Este Mes +5%"
          />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default App;
