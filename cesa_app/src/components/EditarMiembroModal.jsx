import React, { useState, useEffect } from "react";
import { createMember, updateMember } from "../services/api_miembros.js";

export default function EditarMiembroModal({ onClose, memberData }) {
  const [form, setForm] = useState({
    numero_control: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    rol: "",
    cargo: "",
    coordinacion: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (memberData) setForm(memberData);
  }, [memberData]);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (memberData) {
        await updateMember(memberData.numero_control, form);
      } else {
        await createMember(form);
      }
      onClose();
    } catch (err) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{memberData ? "Editar Miembro" : "Agregar Miembro"}</h2>
          <button onClick={onClose} className="text-gray-600">✖</button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium">Número Control (NC)</label>
            <input name="numero_control" value={form.numero_control} onChange={handleChange} required className="w-full px-3 py-2 border rounded" disabled={!!memberData} />
          </div>
          <div>
            <label className="text-sm font-medium">Correo</label>
            <input name="correo" value={form.correo} onChange={handleChange} type="email" required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Nombre</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Rol</label>
            <input name="rol" value={form.rol} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Apellido Paterno</label>
            <input name="apellido_paterno" value={form.apellido_paterno} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Cargo</label>
            <input name="cargo" value={form.cargo} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Apellido Materno</label>
            <input name="apellido_materno" value={form.apellido_materno} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="text-sm font-medium">Coordinación</label>
            <input name="coordinacion" value={form.coordinacion} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
          </div>

          {error && <div className="text-red-600 col-span-2">{error}</div>}

          <div className="col-span-2 flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
