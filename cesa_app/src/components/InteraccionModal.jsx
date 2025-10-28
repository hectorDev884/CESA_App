import React, { useState, useEffect } from "react";
import { getInteractions, addInteraction, getMembers } from "../services/api_miembros.js";

export default function InteraccionModal({ onClose, member }) {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [members, setMembers] = useState([]);
  const [to, setTo] = useState("");

  useEffect(() => {
    async function load() {
      const it = await getInteractions(member.numero_control);
      setList(it || []);
      const all = await getMembers();
      setMembers(all.filter((m) => m.numero_control !== member.numero_control));
      if (all.length) setTo(all[0].numero_control);
    }
    load();
  }, [member]);

  const handleAdd = async () => {
    if (!text || !to) return;
    const newIt = { from: member.numero_control, to, message: text };
    await addInteraction(member.numero_control, newIt);
    const updated = await getInteractions(member.numero_control);
    setList(updated || []);
    setText("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Interacciones de {member.nombre}</h2>
          <button onClick={onClose} className="text-gray-600">✖</button>
        </div>

        <div className="mb-4">
          <label className="text-sm">Enviar a:</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-3 py-2 border rounded mt-1">
            {members.map((m) => (
              <option key={m.numero_control} value={m.numero_control}>{m.nombre} ({m.numero_control})</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm">Mensaje / Nota</label>
          <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-2 border rounded" />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
          <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded">Enviar</button>
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="font-semibold mb-2">Historial</h3>
          {list.length === 0 && <div className="text-sm text-gray-600">Sin interacciones</div>}
          <ul className="space-y-2">
            {list.map((it, idx) => (
              <li key={idx} className="p-2 border rounded">
                <div className="text-sm text-gray-700"><strong>Para:</strong> {it.to}</div>
                <div className="text-sm text-gray-700"><strong>Mensaje:</strong> {it.message}</div>
                <div className="text-xs text-gray-500">{it.timestamp || ''}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
