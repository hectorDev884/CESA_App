import React, { useEffect, useState } from "react";
import { getMembers, addInteraction } from "../services/api_miembros.js";

export default function NewInteraccionModal({ onClose, onSaved }) {
  const [members, setMembers] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [tipo, setTipo] = useState("Mensaje");

  useEffect(() => {
    async function load() {
      const all = await getMembers();
      setMembers(all);
      if (all.length) {
        setFrom(all[0].numero_control);
        setTo(all.length > 1 ? all[1].numero_control : all[0].numero_control);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    if (!from || !to || !message) return;
    const newIt = { from, to, message, tipo, timestamp: new Date().toISOString() };
    await addInteraction(from, newIt);
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nueva interacción</h2>
          <button onClick={onClose} className="text-gray-600">✖</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Desde (miembro)</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-3 py-2 border rounded mt-1">
              {members.map((m) => (
                <option key={m.numero_control} value={m.numero_control}>{m.nombre} ({m.numero_control})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Para</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 border rounded mt-1">
              {members.map((m) => (
                <option key={m.numero_control} value={m.numero_control}>{m.nombre} ({m.numero_control})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full px-3 py-2 border rounded mt-1">
              <option>Mensaje</option>
              <option>Llamada</option>
              <option>Correo</option>
              <option>Reunión</option>
            </select>
          </div>

          <div>
            <label className="text-sm">Asunto</label>
            <input value={""} readOnly className="w-full px-3 py-2 border rounded mt-1 bg-gray-100" placeholder="(opcional)" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm">Mensaje / Descripción</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancelar</button>
          <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
        </div>
      </div>
    </div>
  );
}
