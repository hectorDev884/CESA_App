import React, { useState, useEffect } from "react";

export default function AddOffice() {
  const [tramites, setTramites] = useState([]);
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estatus, setEstatus] = useState("Pendiente");
  const [documento, setDocumento] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("sa_tramites_v1")) || [];
    setTramites(stored);
  }, []);

  const saveToLocal = (data) => {
    localStorage.setItem("sa_tramites_v1", JSON.stringify(data));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDocumento(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addTramite = () => {
    if (!tipo || !descripcion) return;
    const newTramites = [
      ...tramites,
      {
        tipo,
        descripcion,
        estatus,
        documento,
        fecha: new Date().toLocaleString(),
      },
    ];
    setTramites(newTramites);
    saveToLocal(newTramites);
    setTipo("");
    setDescripcion("");
    setEstatus("Pendiente");
    setDocumento(null);
  };

  const deleteTramite = (index) => {
    const newTramites = tramites.filter((_, i) => i !== index);
    setTramites(newTramites);
    saveToLocal(newTramites);
  };

  const editTramite = (index) => {
    const t = tramites[index];
    setTipo(t.tipo);
    setDescripcion(t.descripcion);
    setEstatus(t.estatus);
    setDocumento(t.documento);
    setEditIndex(index);
  };

  const updateTramite = () => {
    const updated = [...tramites];
    updated[editIndex] = {
      tipo,
      descripcion,
      estatus,
      documento,
      fecha: new Date().toLocaleString(),
    };
    setTramites(updated);
    saveToLocal(updated);
    setEditIndex(null);
    setTipo("");
    setDescripcion("");
    setEstatus("Pendiente");
    setDocumento(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Gestión de Trámites</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Seleccionar tipo</option>
          <option>Justificante</option>
          <option>Oficio</option>
          <option>Solicitud</option>
          <option>Petición</option>
          <option>Invitación</option>
        </select>

        <select
          value={estatus}
          onChange={(e) => setEstatus(e.target.value)}
          className="border p-2 rounded"
        >
          <option>Pendiente</option>
          <option>En revisión</option>
          <option>Aprobado</option>
          <option>Rechazado</option>
        </select>

        <input
          type="text"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="border p-2 rounded col-span-2"
        />

        <input
          type="file"
          onChange={handleFileUpload}
          className="border p-2 rounded col-span-2"
        />

        {editIndex !== null ? (
          <button
            onClick={updateTramite}
            className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
          >
            Actualizar
          </button>
        ) : (
          <button
            onClick={addTramite}
            className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
          >
            Agregar
          </button>
        )}
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Tipo</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Estatus</th>
            <th className="p-2 border">Documento</th>
            <th className="p-2 border">Fecha</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tramites.map((t, i) => (
            <tr key={i}>
              <td className="p-2 border">{t.tipo}</td>
              <td className="p-2 border">{t.descripcion}</td>
              <td className="p-2 border">{t.estatus}</td>
              <td className="p-2 border">
                {t.documento ? (
                  <a
                    href={t.documento}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Ver documento
                  </a>
                ) : (
                  "Sin archivo"
                )}
              </td>
              <td className="p-2 border">{t.fecha}</td>
              <td className="p-2 border flex gap-2 justify-center">
                <button
                  onClick={() => editTramite(i)}
                  className="bg-yellow-500 text-white px-3 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteTramite(i)}
                  className="bg-red-600 text-white px-3 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
