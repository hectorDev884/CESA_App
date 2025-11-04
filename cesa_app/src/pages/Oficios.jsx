import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_LIST_URL = "http://127.0.0.1:8000/api/oficios/lista/";

const Oficios = () => {
  const [oficios, setOficios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOficios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_LIST_URL);

      if (!response.ok) {
        throw new Error(
          `Error en la API: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      setOficios(data);
    } catch (err) {
      console.error("Fallo la carga de oficios:", err);
      setError("No se pudieron cargar los oficios. Verifica la API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOficios();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-blue-600">Cargando oficios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-red-100 text-red-700 border border-red-400 rounded-lg">
        <p className="font-bold">Error de Carga:</p>
        <p>{error}</p>
        <p>Asegúrate de que el servidor de Django esté corriendo.</p>
      </div>
    );
  }

  // Si no hay oficios
  if (oficios.length === 0) {
    return (
      <div className="text-center p-10">
        <p className="text-xl text-gray-500">No hay oficios registrados.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sistema de Oficios - Comité Ejecutivo de la Sociedad de Alumnos (CESA)
      </h1>

      <div className="flex justify-center gap-3 mb-6">
        <Link
          to={"/oficios/agregar-oficio"}
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
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Número de Oficio
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Tipo Oficio
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Asunto
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Destinatario
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Estado
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Ver pdf
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {oficios.map((oficio) => (
              <tr key={oficio.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {oficio.numero_oficio_completo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {oficio.tipo_oficio}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {oficio.asunto}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {oficio.destinatario}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      oficio.estado === "Entregado"
                        ? "bg-green-100 text-green-700"
                        : oficio.estado === "Pendiente"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {oficio.estado || "N/A"}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm text-[#036942] font-medium">
                  {new Date(oficio.fecha_creacion).toLocaleDateString()}{" "}
                </td>

                <td className="px-4 py-3 text-center">
                  <a
                    href={oficio.documento_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 transition duration-150 inline-block z-10"
                    title="Abrir Documento PDF"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0111 3.414L15.586 8a2 2 0 01.414 1.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 10a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1-5a1 1 0 100 2h4a1 1 0 100-2H7z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
          Mostrando {oficios.length} oficios.
        </div>
      </div>
    </div>
  );
};

export default Oficios;
