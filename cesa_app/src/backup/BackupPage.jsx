import React, { useState } from "react";
import { generarBackup } from "../services/api_becas_estudiante";

export default function BackupPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackup = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Debes ingresar un nombre para el backup.");
      return;
    }

    setLoading(true);
    try {
      await generarBackup(name);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-20 bg-gray-50 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Crear Backup de la Base de Datos
        </h2>

        <form onSubmit={handleBackup} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del respaldo
            </label>
            <input
              type="text"
              placeholder="ej: backup_2025_11_25"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#036942] focus:border-transparent transition-all disabled:bg-gray-100 disabled:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition-colors duration-200 flex justify-center items-center shadow-md
              ${loading 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#036942] hover:bg-green-700 active:scale-[0.98]"
              }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creando...
              </>
            ) : (
              "Crear Backup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}