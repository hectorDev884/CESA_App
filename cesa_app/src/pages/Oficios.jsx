import React, { useState } from "react";
import AddOffice from "../components/AddOffice.jsx";
import { Link } from "react-router-dom";

const Eventos = () => {
  const [active, setActive] = useState("office");

  const offices = [
    {
      key: 1,
      name: "S001",
      archive: "S001.pdf",
      date: "2025-10-14",
      status: "Entregado",
    },
    {
      key: 2,
      name: "J001",
      archive: "J001.pdf",
      date: "2025-10-01",
      status: "En espera",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Sistema de Oficios - Comité Ejecutivo de la Sociedad de Alumnos (CESA)
        del ITCG
      </h1>

      <div className="flex justify-center gap-3 mb-6">
        {/* Agregar Oficio */}
        <Link
          to={"/oficios/agregar-oficio"}
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
        </Link>

        {/* Control de oficios */}
      </div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Archive
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {offices.map((office) => (
              <tr key={office.key} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {office.name}
                </td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">
                  {office.archive}
                </td>
                <td className="px-4 py-3 text-sm text-[#036942] font-medium">
                  {office.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      office.status === "Entregado"
                        ? "bg-green-100 text-green-700"
                        : office.status === "En espera"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {office.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536M9 13l3 3 8-8-3-3-8 8z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleDelete(student.numeroControl)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        {/* <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
            Mostrando {filteredStudents.length} de {students.length} estudiantes
          </div> */}
      </div>
    </div>
  );
};

export default Eventos;
