import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function MiembrosModal({ miembro, onClose }) {
const [formData, setFormData] = useState({
nc: "",
nombre: "",
apellido_paterno: "",
apellido_materno: "",
correo: "",
cargo: "",
rol: "",
coordinacion: "Gestión Empresarial",
activo: true,
});

useEffect(() => {
if (miembro) setFormData({ ...miembro });
}, [miembro]);

const handleChange = (e) => {
const { name, value, type, checked } = e.target;
setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
};

const handleSubmit = async (e) => {
e.preventDefault();
try {
if (formData.id) {
// Actualizar
const { error } = await supabase
.from("miembros")
.update(formData)
.eq("id", formData.id);
if (error) throw error;
} else {
// Insertar
const { error } = await supabase.from("miembros").insert([formData]);
if (error) throw error;
}
onClose();
} catch (error) {
console.error("Error al guardar miembro:", error.message);
}
};

return ( <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"> <div className="bg-white rounded-lg shadow-lg p-6 w-96"> <h2 className="text-xl font-semibold mb-4 text-center">
{formData.id ? "Editar Miembro" : "Agregar Miembro"} </h2> <form onSubmit={handleSubmit} className="space-y-2"> <input
         type="text"
         name="nc"
         placeholder="Número de Control"
         value={formData.nc}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
         required
       /> <input
         type="text"
         name="nombre"
         placeholder="Nombre"
         value={formData.nombre}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
         required
       /> <input
         type="text"
         name="apellido_paterno"
         placeholder="Apellido Paterno"
         value={formData.apellido_paterno}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
         required
       /> <input
         type="text"
         name="apellido_materno"
         placeholder="Apellido Materno"
         value={formData.apellido_materno}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
         required
       /> <input
         type="email"
         name="correo"
         placeholder="Correo"
         value={formData.correo}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
         required
       /> <input
         type="text"
         name="rol"
         placeholder="Rol"
         value={formData.rol}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
       /> <input
         type="text"
         name="cargo"
         placeholder="Cargo"
         value={formData.cargo}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
       /> <select
         name="coordinacion"
         value={formData.coordinacion}
         onChange={handleChange}
         className="w-full border px-2 py-1 rounded"
       > <option>Gestión Empresarial</option> <option>Inclusión y Bienestar</option> <option>Industrial</option> <option>Informática</option> <option>Innovación y Gestión Académica</option> <option>Lenguas e Intercambio</option> <option>Mecánica</option> <option>Relaciones Públicas</option> <option>Computacionales</option> <option>Sustentabilidad y Medio Ambiente</option> <option>Vinculación y Representación</option> </select>

```
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="activo"
          checked={formData.activo}
          onChange={handleChange}
        />
        Activo
      </label>

      <div className="flex justify-between mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </form>
  </div>
</div>

);
}
