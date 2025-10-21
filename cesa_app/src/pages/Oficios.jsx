import React, { useState } from "react";

const Eventos = () => {
  const [active, setActive] = useState("office");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sistema de Oficios - Comité Ejecutivo de la Sociedad de Alumnos (CESA)
        del ITCG
      </h1>

      <div className="flex justify-center gap-3 mb-6">
        {/* Agregar Oficio */}
        <button
          onClick={() => setActive("office")}
          className="mt-4 sm:mt-0 bg-[#036942] text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 hover:cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Agregar Oficio
        </button>

        {/* Control de oficios */}
      </div>
    </div>
  );
};

export default Eventos;
