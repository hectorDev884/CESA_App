import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-[#036942] shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h2 className="text-white text-xl font-semibold">C.E.S.A</h2>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/eventos"
                className="text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Eventos
              </Link>
              <Link
                to="/financiero"
                className="text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Financiero
              </Link>
              <Link
                to="/miembros"
                className="text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Miembros
              </Link>
              <Link
                to="/becas"
                className="text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Becas
              </Link>
              <Link
                to="/estudiantes"
                className="text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Estudiantes
              </Link>
              <Link
                to="/oficios"
                className="text-white hover:bg-white hover:text-black hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Oficios
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <div className="flex items-center space-x-2">
                <span className="text-white text-sm font-medium">Admin</span>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  className={!isMenuOpen ? "block" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={isMenuOpen ? "block" : "hidden"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#036942] border-t border-white border-opacity-10">
          <Link
            to="/eventos"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Eventos
          </Link>
          <Link
            to="/financiero"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Financiero
          </Link>
          <Link
            to="/miembros"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Miembros
          </Link>
          <Link
            to="/becas"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Becas
          </Link>
          <Link
            to="/estudiantes"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Estudiantes
          </Link>
          <Link
            to="/oficios"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
            onClick={toggleMenu}
          >
            Oficios
          </Link>
          <div className="pt-4 pb-3 border-t border-white border-opacity-10">
            <div className="flex items-center px-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
