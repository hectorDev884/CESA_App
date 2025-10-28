// src/components/MiembrosModal.jsx
import React from "react";

export default function MiembrosModal({ members, handleEdit, handleDelete }) {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">NC</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Correo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cargo</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Coordinación</th>
            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {members.map((m) => (
            <tr key={m.numero_control} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-sm text-gray-900">{m.numero_control}</td>
              <td className="px-4 py-3 text-sm text-[#036942] font-medium">
                {m.nombre} {m.apellido_paterno} {m.apellido_materno}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{m.correo}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{m.rol}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{m.cargo}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{m.coordinacion}</td>
              <td className="px-4 py-3 flex justify-center gap-3">
                <button
                  className="text-blue-600 hover:text-blue-800 cursor-pointer hover:cursor-pointer"
                  onClick={() => handleEdit(m)}
                >
                  ✏️ {/* Editar/Ver Detalles (abre el modal de edición) */}
                </button>
                {/* Se eliminó el globo de texto - ya no se muestra */}
                <button
                  className="text-red-600 hover:text-red-800 cursor-pointer hover:cursor-pointer"
                  onClick={() => handleDelete(m.numero_control)}
                >
                  ❌ {/* Eliminar (llama a la función con confirmación) */}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
        Mostrando {members.length} miembros
      </div>
    </div>
  );
}