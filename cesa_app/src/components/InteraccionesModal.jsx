import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export default function InteraccionesModal({ interaccion, onClose }) {
  const [formData, setFormData] = useState({
    tipo: "",
    fecha: "",
    tema: "",
    descripcion: "",
    miembro_id: "",
  });

  useEffect(() => {
    if (interaccion) setFormData({ ...interaccion });
  }, [interaccion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 🐛 CORRECCIÓN CLAVE: Convertir miembro_id a número para que coincida con int8 en la DB
      const dataToSubmit = {
        ...formData,
        miembro_id: formData.miembro_id ? parseInt(formData.miembro_id) : null,
      };

      if (formData.id) {
        // Actualizar
        const { error } = await supabase
          .from("interacciones")
          .update(dataToSubmit)
          .eq("id", formData.id);
        if (error) throw error;
      } else {
        // Insertar
        // Se usa dataToSubmit que tiene el miembro_id como número
        const { error } = await supabase.from("interacciones").insert([dataToSubmit]);
        if (error) throw error;
      }
      onClose();
      // Llama a la función de recarga en el componente padre si la operación fue exitosa
    } catch (error) {
      // ✅ IMPORTANTE: Revisa la consola para ver el mensaje completo en caso de fallo
      console.error("Error al guardar interacción:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">
          {formData.id ? "Editar Interacción" : "Nueva Interacción"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            name="tipo"
            placeholder="Tipo de interacción"
            value={formData.tipo}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <input
            type="text"
            name="tema"
            placeholder="Tema principal"
            value={formData.tema}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />
          <textarea
            name="descripcion"
            placeholder="Descripción"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            rows="3"
            required
          />
          <input
            type="number"
            name="miembro_id"
            placeholder="ID del miembro responsable"
            value={formData.miembro_id}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
            required
          />

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