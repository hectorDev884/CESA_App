import React from "react";
import Navigation from "./components/Navigation.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Estudiantes from "./pages/Estudiantes.jsx";
import GuestRoute from "./routes/GuestRoute";
import Oficios from "./pages/Oficios.jsx";
import Footer from "./components/Footer.jsx";
import Becas from "./pages/Becas.jsx";
import Eventos from "./pages/Eventos.jsx";
import Miembros from "./pages/Miembros.jsx";
import Financiero from "./pages/Financieros.jsx";
import AgregarEstudiantesForm from "./components/AgregarEstudiantesForm.jsx";
import RegistrarBecaForm from "./components/RegistrarBecasForm.jsx";
import AddOffice from "./components/AddOffice.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import LoginForm from "./components/LoginForm.jsx";
import BackupPage from "./backup/BackupPage.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import Reportes from "./pages/Reportes.jsx";
import Ayudas from "./pages/Ayudas.jsx";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  const isAdmin = user?.rol === 1;
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation isAdmin={isAdmin} />

        <main className="pt-16">
          <Routes>

            {/* SOLO invitados */}
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<LoginForm />} />
              <Route path="/register" element={<RegisterForm />} />
            </Route>

            {/* SOLO logueados */}
            <Route element={<ProtectedRoute />}>

              <Route path="/" element={<Dashboard />} />
              <Route path="/estudiantes" element={<Estudiantes />} />
              <Route path="/oficios" element={<Oficios />} />
              <Route path="/becas" element={<Becas />} />
              <Route path="/eventos" element={<Eventos />} />
              <Route path="/miembros" element={<Miembros />} />
              <Route path="/agregar-estudiante" element={<AgregarEstudiantesForm />} />
              <Route path="/agregar-beca" element={<RegistrarBecaForm />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/ayudas" element={<Ayudas />} />

              {/* SOLO ADMIN */}
              <Route element={<RoleRoute allowedRoles={[1]} />}>
                <Route path="/backup" element={<BackupPage />} />
                <Route path="/financiero" element={<Financiero />} />
              </Route>

            </Route>

          </Routes>

          <Footer />
        </main>
      </div>
    </Router>
  );
}

export default App;
