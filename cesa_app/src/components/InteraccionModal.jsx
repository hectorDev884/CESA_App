import React, { useState, useEffect } from "react";
import { getInteractions, addInteraction, getMembers, deleteInteraction } from "../services/api_miembros.js";

export default function InteraccionModal({ onClose, member }) {
  const [list, setList] = useState([]);
  const [text, setText] = useState("");
  const [asunto, setAsunto] = useState("");
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

  const [fecha, setFecha] = useState("");

  const handleAdd = async () => {
    if (!text || !to) return;
    const ts = fecha ? new Date(fecha).toISOString() : new Date().toISOString();
    const newIt = { from: member.numero_control, to, message: text, asunto, timestamp: ts };
    await addInteraction(member.numero_control, newIt);
    const updated = await getInteractions(member.numero_control);
    setList(updated || []);
    setText("");
    setFecha("");
  };

  const handleDelete = async (timestamp) => {
    if (!window.confirm("¿Eliminar esta interacción?")) return;
    await deleteInteraction(member.numero_control, timestamp);
    const updated = await getInteractions(member.numero_control);
    setList(updated || []);
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

          <div className="mt-3">
            <label className="text-sm">Asunto</label>
            <input value={asunto} onChange={(e) => setAsunto(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" placeholder="(opcional)" />
          </div>

          <div className="mt-3">
            <label className="text-sm">Mensaje / Nota</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Fecha y hora</label>
              <input type="datetime-local" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full px-3 py-2 border rounded mt-1" />
            </div>
            <div>
              <label className="text-sm">&nbsp;</label>
              <div className="flex justify-end gap-2">
                <button onClick={onClose} className="px-4 py-2 border rounded">Cerrar</button>
                <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded">Enviar</button>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div>
          <h3 className="font-semibold mb-2">Historial</h3>
          {list.length === 0 && <div className="text-sm text-gray-600">Sin interacciones</div>}
          <ul className="space-y-2">
            {list.map((it, idx) => (
              <li key={it.timestamp || idx} className="p-2 border rounded flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-700"><strong>Para:</strong> {it.to}</div>
                  <div className="text-sm text-gray-700"><strong>Asunto:</strong> {it.asunto || '-'}</div>
                  <div className="text-sm text-gray-700"><strong>Mensaje:</strong> {it.message}</div>
                  <div className="text-xs text-gray-500">{it.timestamp || ''}</div>
                </div>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 cursor-pointer" onClick={() => {
                    // editar mensaje y asunto mediante prompts simple (rápido)
                    const nuevo = window.prompt("Editar mensaje:", it.message);
                    if (nuevo !== null) {
                      const nuevoAsunto = window.prompt("Editar asunto:", it.asunto || "");
                      // continue if not cancelled
                      // actualizar interacción: usamos update via addInteraction? no, se necesita endpoint
                      // Pero para rapidez, usamos addInteraction with same timestamp to replace via updateInteraction if available elsewhere
                      // Here we will call addInteraction with same timestamp on parent — but better to call updateInteraction via service; but not imported to avoid circular
                      // We'll implement a quick workaround by calling window.alert to suggest usar la vista Interacciones para editar.
                      // For now, implement a delete and re-add to emulate edit
                      // Not ideal but keeps behavior simple in UI: deleteInteraction then addInteraction
                      // We'll rely on parent to refresh by reloading list after prompts
                      (async () => {
                        try {
                          // import updateInteraction dynamically
                          const api = await import("../services/api_miembros.js");
                          await api.updateInteraction(member.numero_control, it.timestamp, { ...it, message: nuevo, asunto: nuevoAsunto });
                          const updated = await getInteractions(member.numero_control);
                          setList(updated || []);
                        } catch (e) {
                          console.error(e);
                          alert("Error al editar interacción");
                        }
                      })();
                    }
                  }}>✏️</button>
                  <button className="text-red-600 hover:text-red-800 cursor-pointer" onClick={() => handleDelete(it.timestamp)}>❌</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
