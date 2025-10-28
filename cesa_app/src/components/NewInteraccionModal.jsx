import React, { useEffect, useState } from "react";
import { getMembers, addInteraction, updateInteraction } from "../services/api_miembros.js";

export default function NewInteraccionModal({ onClose, onSaved, initial }) {
  const [members, setMembers] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [tipo, setTipo] = useState("Mensaje");
  const [asunto, setAsunto] = useState("");
  const [fecha, setFecha] = useState("");
  const editing = Boolean(initial && initial.timestamp);

  useEffect(() => {
    async function load() {
      const all = await getMembers();
      setMembers(all);
      if (all.length) {
        setFrom(initial?.from || all[0].numero_control);
        setTo(initial?.to || (all.length > 1 ? all[1].numero_control : all[0].numero_control));
        setTipo(initial?.tipo || "Mensaje");
        setMessage(initial?.message || "");
        setAsunto(initial?.asunto || "");
        setFecha(initial?.timestamp ? formatForInput(initial.timestamp) : "");
      }
    }
    load();
  }, [initial]);

  function formatForInput(ts) {
    try {
      const d = new Date(ts);
      // to yyyy-MM-ddTHH:mm
      const pad = (n) => String(n).padStart(2, "0");
      const y = d.getFullYear();
      const m = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hh = pad(d.getHours());
      const mm = pad(d.getMinutes());
      return `${y}-${m}-${day}T${hh}:${mm}`;
    } catch (e) {
      return "";
    }
  }

  const handleSave = async () => {
    if (!from || !to || !message) return;
    const ts = fecha ? new Date(fecha).toISOString() : new Date().toISOString();
    const newIt = { from, to, message, asunto, tipo, timestamp: ts };
    if (editing && initial) {
      // update existing interaction stored under initial.from
      await updateInteraction(initial.from, initial.timestamp, newIt);
    } else {
      await addInteraction(from, newIt);
    }
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
            <input value={asunto} onChange={(e) => setAsunto(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" placeholder="(opcional)" />
          </div>

          <div>
            <label className="text-sm">Fecha y hora</label>
            <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
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
