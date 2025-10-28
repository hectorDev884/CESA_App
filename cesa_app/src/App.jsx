import React from "react";
import Navigation from "./components/Navigation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Estudiantes from "./pages/Estudiantes.jsx";
import Oficios from "./pages/Oficios.jsx";
import Footer from "./components/Footer.jsx";
import Becas from "./pages/Becas.jsx";
import Eventos from "./pages/Eventos.jsx";
import Miembros from "./pages/Miembros.jsx";
import Financiero from "./pages/Financieros.jsx";
import AgregarEstudiantesForm from "./components/AgregarEstudiantesForm.jsx";
import RegistrarBecaForm from "./components/RegistrarBecasForm.jsx";
import AddOffice from "./components/AddOffice.jsx";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navigation />

        {/* Main Content */}
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/estudiantes" element={<Estudiantes />} />
            <Route path="/oficios" element={<Oficios />} />
            <Route path="/becas" element={<Becas />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/miembros" element={<Miembros />} />
            <Route path="/financiero" element={<Financiero />} />
            <Route
              path="/agregar-estudiante"
              element={<AgregarEstudiantesForm />}
            />
            <Route path="/agregar-beca" element={<RegistrarBecaForm />} />
            <Route path="/oficios/agregar-oficio" element={<AddOffice />} />
            {/* Add more routes as needed  TODO: AgregarBecas route*/}
          </Routes>
          {/* Footer */}
          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
