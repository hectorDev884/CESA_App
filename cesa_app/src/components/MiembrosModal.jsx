import React, { useState, useEffect } from "react";

/**
 * Modal para agregar o editar un miembro del comité.
 * @param {function} onClose - Función para cerrar el modal.
 * @param {function} onSave - Función para guardar los datos (maneja agregar o editar).
 * @param {object} miembroData - Datos del miembro si es edición, o null si es agregar.
 */
export default function MiembrosModal({ onClose, onSave, miembroData }) {
  const isEditing = !!miembroData;
  const initialData = {
    miembro_id: "", 
    nc: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    cargo: "Vocal", 
    rol: "Operativo", 
    coordinacion: "Becas", 
  };

  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    if (miembroData) {
      setFormData((prev) => ({
        ...prev,
        ...miembroData,
      }));
    } else {
      setFormData(initialData);
    }
  }, [miembroData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nc.toString().trim() || !formData.nombre.trim() || !formData.apellido_paterno.trim()) {
      alert("Por favor, completa los campos obligatorios: NC, Nombre y Apellido Paterno.");
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl relative animate-fadeIn border border-gray-200 max-h-[90vh] overflow-y-auto">
        <button
          className="absolute hover:cursor-pointer top-3 right-3 text-gray-500 hover:text-gray-700 text-lg transition-colors"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {isEditing ? "Editar Información del Miembro" : "Registrar Nuevo Miembro del Comité"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Columna izquierda: Datos Personales */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Datos Personales</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NC (Número de Control) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nc"
                value={formData.nc || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Paterno <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="apellido_paterno"
                value={formData.apellido_paterno || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido Materno
              </label>
              <input
                type="text"
                name="apellido_materno"
                value={formData.apellido_materno || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

          </div>

          {/* Columna derecha: Datos del Comité */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">Datos del Comité</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cargo
              </label>
              <select
                name="cargo"
                value={formData.cargo || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Presidente">Presidente</option>
                <option value="Secretario">Secretario</option>
                <option value="Tesorero">Tesorero</option>
                <option value="Vocal">Vocal</option>
                <option value="Asesor">Asesor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                name="rol"
                value={formData.rol || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Administrativo">Administrativo</option>
                <option value="Académico">Académico</option>
                <option value="Operativo">Operativo</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coordinación
              </label>
              <select
                name="coordinacion"
                value={formData.coordinacion || ""}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="General">General</option>
                <option value="Becas">Becas</option>
                <option value="Eventos">Eventos</option>
                <option value="Finanzas">Finanzas</option>
              </select>
            </div>

            {isEditing && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estatus (Solo Edición)
                    </label>
                    <select
                        name="activo"
                        value={formData.activo ? 'true' : 'false'}
                        onChange={(e) => setFormData(prev => ({...prev, activo: e.target.value === 'true'}))}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                    </select>
                </div>
            )}
            
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Archivo de Nombramiento (opcional)
              </label>
              <input
                type="file"
                name="archivo"
                onChange={() => {}}
                className="w-full text-sm border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
              />
            </div>

          </div>

          {/* Footer del Modal */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {isEditing ? "Guardar Cambios" : "Registrar Miembro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}