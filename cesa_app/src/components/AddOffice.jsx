import React, { useState, useEffect } from "react";

export default function AddOffice() {
  const [tipo, setTipo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [cuerpoTexto, setCuerpoTexto] = useState("");

  const [tramites, setTramites] = useState([]);

  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const generarOficio = async () => {
    if (!tipo || !asunto || !destinatario || !cuerpoTexto) {
      alert(
        "Por favor, complete todos los campos requeridos para generar el oficio."
      );
      return;
    }

    setLoading(true);

    let prefijoTipo = "";
    switch (tipo) {
      case "Justificante":
        prefijoTipo = "J";
        break;
      case "Oficio":
        prefijoTipo = "O";
        break;
      case "Solicitud":
        prefijoTipo = "S";
        break;
      case "Invitación":
        prefijoTipo = "I";
        break;
      default:
        prefijoTipo = "X";
    }

    const dataToSend = {
      tipo_oficio: prefijoTipo,
      asunto: asunto,
      destinatario: destinatario,
      cuerpo_texto: cuerpoTexto,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/oficios/generar/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // credentials: "include",
          body: JSON.stringify(dataToSend),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(`Oficio ${result.numero_oficio} generado con éxito.`);

        if (result.url_descarga) {
          window.open(result.url_descarga, "_blank");
        }

        setTipo("");
        setAsunto("");
        setDestinatario("");
        setCuerpoTexto("");
      } else {
        console.error("Error en el servidor: ", result);
        alert(
          `Error al generar el oficio: ${
            result.error || JSON.stringify(result)
          }`
        );
      }
    } catch (error) {
      console.error("Falló la conexión con el servidor: ", error);
      alert(
        "Falló la conexión con el servidor de Django. Asegúrate de que esté corriendo exitosamente."
      );
    } finally {
      setLoading(false);
    }
  };

  const editTramite = (index) => {
    alert(
      "La edición de registros en la tabla debe implementarse con la API de Django."
    );
  };

  const deleteTramite = (index) => {
    alert(
      "La eliminación de registros debe implementarse con la API de Django."
    );
  };

  const updateTramite = () => {
    alert(
      "La actualización de registros debe implementarse con la API de Django."
    );
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 mt-10 rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Generación de Oficios C.E.S.A.
      </h2>

      {/* Sección de Formulario */}
      <div className="space-y-4 mb-8 p-4 border rounded-lg bg-gray-50">
        <h3 className="text-xl font-semibold mb-3 text-gray-700">
          Generar Nuevo Oficio (Generación de PDF)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tipo de Trámite (Selección del prefijo) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tipo de Oficio
            </label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Seleccionar tipo</option>
              {/* Los values que se envían son las iniciales (prefijos) */}
              <option>Justificante</option>
              <option>Oficio</option>
              <option>Solicitud</option>
              <option>Petición</option>
              <option>Invitación</option>
            </select>
          </div>

          {/* Destinatario */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Destinatario (Nombre o Cargo)
            </label>
            <input
              type="text"
              placeholder="Ej: C. JAIRO GIOVANNI ALVAREZ JUAREZ"
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Asunto del Oficio
          </label>
          <input
            type="text"
            placeholder="asunto breve que aparecerá en el oficio"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Cuerpo del Oficio (Contenido principal) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cuerpo del Oficio (Texto principal)
          </label>
          <textarea
            placeholder="Escribe aquí el contenido principal del oficio. Los saltos de línea se respetarán como párrafos."
            value={cuerpoTexto}
            onChange={(e) => setCuerpoTexto(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
        </div>

        {/* Los campos originales de Estatus y Carga de Documento se han removido */}

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 pt-4">
          {/* El botón de Cancelar/Actualizar se simplifica/elimina si solo estamos generando */}
          {editIndex !== null && (
            <button
              onClick={() => {
                setEditIndex(null);
                setTipo("");
                setAsunto("");
                setDestinatario("");
                setCuerpoTexto("");
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition duration-150"
            >
              Cancelar Edición
            </button>
          )}

          <button
            onClick={generarOficio}
            className={`px-4 py-2 text-white rounded-lg transition duration-150 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Generando Oficio..." : "Generar Oficio en .PDF"}
          </button>
        </div>
      </div>

      {/* Sección de Lista de Trámites (Se mantiene la estructura de la tabla) */}
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        Trámites Registrados (Lista Local - {tramites.length})
      </h3>
      {/* El contenido de la tabla DEBE actualizarse para reflejar los datos del backend */}
      <div className="overflow-x-auto">
        {/* Aquí iría la tabla, idealmente cargando datos de un endpoint GET de Django */}
        <p className="text-center text-gray-500 p-4 border rounded-lg bg-gray-50">
          *Esta tabla requiere una nueva función `fetchTramites` para cargar los
          oficios desde su API de Django.*
        </p>
        {/* ... código de la tabla original (simplificado) ... */}
      </div>
    </div>
  );
}
