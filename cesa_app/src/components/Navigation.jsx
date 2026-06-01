import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = ({ isAdmin }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinkStyle =
    "text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300";

  return (
    <nav className="bg-[#036942] shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h2 className="text-white text-xl font-semibold">C.E.S.A</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">

                <Link to="/eventos" className={navLinkStyle}>Eventos</Link>
                <Link to="/miembros" className={navLinkStyle}>Miembros</Link>
                <Link to="/becas" className={navLinkStyle}>Becas</Link>
                <Link to="/estudiantes" className={navLinkStyle}>Estudiantes</Link>
                <Link to="/reportes" className={navLinkStyle}>Reportes</Link>
                <Link to="/reportes-estudiantes" className={navLinkStyle}>Reportes Estud.</Link>
                <Link to="/ayudas" className={navLinkStyle}>Ayudas</Link>

                {/* SOLO ADMIN */}
                {isAdmin && (
                  <Link to="/backup" className={navLinkStyle}>Backup</Link>,
                  <Link to="/financiero" className={navLinkStyle}>Financiero</Link>
                )}

              </div>
            </div>
          )}

          {/* User Menu Desktop */}
          <div className="hidden md:block">
            {user ? (
              <div className="ml-4 flex items-center space-x-3">
                <span className="text-white text-sm font-medium">
                  {user.email}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm hover:bg-opacity-30 transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              ☰
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#036942] border-t border-white border-opacity-10">

          {user && (
            <>
              <Link to="/eventos" onClick={toggleMenu} className={navLinkStyle}>Eventos</Link>
              <Link to="/financiero" onClick={toggleMenu} className={navLinkStyle}>Financiero</Link>
              <Link to="/miembros" onClick={toggleMenu} className={navLinkStyle}>Miembros</Link>
              <Link to="/becas" onClick={toggleMenu} className={navLinkStyle}>Becas</Link>
              <Link to="/estudiantes" onClick={toggleMenu} className={navLinkStyle}>Estudiantes</Link>
              <Link to="/reportes" onClick={toggleMenu} className={navLinkStyle}>Reportes</Link>
              <Link to="/reportes-estudiantes" onClick={toggleMenu} className={navLinkStyle}>Reportes Estud.</Link>
              <Link to="/ayudas" onClick={toggleMenu} className={navLinkStyle}>Ayudas</Link>

              {isAdmin && (
                <Link to="/backup" onClick={toggleMenu} className={navLinkStyle}>
                  Backup
                </Link>,
                <Link to="/financiero" onClick={toggleMenu} className={navLinkStyle}>
                  Financiero
                </Link>
              )}
            </>
          )}

          <div className="pt-4 pb-3 border-t border-white border-opacity-10">
            {user ? (
              <div className="px-3 space-y-3">
                <p className="text-white text-base font-medium">
                  {user.email}
                </p>

                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full bg-red-500 hover:bg-red-600 text-white text-center py-2 rounded-lg transition"
                >
                  Cerrar sesión
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white text-center py-2 rounded-lg transition"
              >
                Iniciar sesión
              </Link>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navigation;