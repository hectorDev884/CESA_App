import React, { useState } from 'react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-[#036942] shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h2 className="text-white text-xl font-semibold">C.E.S.A</h2>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="#events"
                className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Eventos
              </a>
              <a
                href="#financial"
                className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Financiero
              </a>
              <a
                href="#members"
                className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Miembros
              </a>
              <a
                href="#scholarships"
                className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Becas
              </a>
              <a
                href="#students"
                className="text-white hover:bg-white hover:bg-opacity-10 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Estudiantes
              </a>
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
                  className={!isMenuOpen ? 'block' : 'hidden'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                  className={isMenuOpen ? 'block' : 'hidden'}
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
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#036942] border-t border-white border-opacity-10">
          <a
            href="#dashboard"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
          >
            Dashboard
          </a>
          <a
            href="#events"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
          >
            Eventos
          </a>
          <a
            href="#financial"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
          >
            Financiero
          </a>
          <a
            href="#members"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
          >
            Miembros
          </a>
          <a
            href="#scholarships"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
          >
            Becas
          </a>
          <a
            href="#students"
            className="text-white hover:bg-white hover:bg-opacity-10 block px-3 py-2 rounded-md text-base font-medium"
          >
            Estudiantes
          </a>
          <div className="pt-4 pb-3 border-t border-white border-opacity-10">
            <div className="flex items-center px-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
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