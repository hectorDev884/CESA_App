import React, { useState } from "react";
import SummaryCard from "../components/SummaryCard.jsx";
import FinanzasModal from "../components/FinanzasModal.jsx";
import FinanzasDetalle from "../components/FinanzasDetalle.jsx";

export default function Financieros() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [registroActual, setRegistroActual] = useState(null);
  const [detalleTipo, setDetalleTipo] = useState(null); // 🔸 Nuevo estado para detalle

 const [finanzas, setFinanzas] = useState([
  {
    id: 1,
    concepto: "Venta de boletos evento cultural",
    tipo: "Ingreso",
    monto: 4500,
    categoria: "Evento",
    fecha: "2024-10-01",
  },
  {
    id: 2,
    concepto: "Apoyo becas estudiantiles",
    tipo: "Egreso",
    monto: 3200,
    categoria: "Beca",
    fecha: "2024-09-15",
  },
  {
    id: 3,
    concepto: "Donación alumnos",
    tipo: "Ingreso",
    monto: 1500,
    categoria: "Donación",
    fecha: "2024-08-10",
  },
  {
    id: 4,
    concepto: "Venta de dulces kermés",
    tipo: "Ingreso",
    monto: 850,
    categoria: "Evento",
    fecha: "2024-10-05",
  },
  {
    id: 5,
    concepto: "Compra material deportivo",
    tipo: "Egreso",
    monto: 1200,
    categoria: "Deportes",
    fecha: "2024-09-25",
  },
  {
    id: 6,
    concepto: "Pago mantenimiento impresora",
    tipo: "Egreso",
    monto: 750,
    categoria: "Equipos",
    fecha: "2024-08-22",
  },
  {
    id: 7,
    concepto: "Inscripción nuevos miembros",
    tipo: "Ingreso",
    monto: 2300,
    categoria: "Socios",
    fecha: "2024-07-10",
  },
  {
    id: 8,
    concepto: "Pago servicio de limpieza",
    tipo: "Egreso",
    monto: 600,
    categoria: "Servicios",
    fecha: "2024-07-28",
  },
  {
    id: 9,
    concepto: "Rifa de recaudación",
    tipo: "Ingreso",
    monto: 3000,
    categoria: "Evento",
    fecha: "2024-06-30",
  },
  {
    id: 10,
    concepto: "Compra papelería",
    tipo: "Egreso",
    monto: 400,
    categoria: "Material",
    fecha: "2024-06-25",
  },
  {
    id: 11,
    concepto: "Pago transporte visita académica",
    tipo: "Egreso",
    monto: 1800,
    categoria: "Transporte",
    fecha: "2024-05-12",
  },
  {
    id: 12,
    concepto: "Venta de comida semana cultural",
    tipo: "Ingreso",
    monto: 2700,
    categoria: "Evento",
    fecha: "2024-05-10",
  },
  {
    id: 13,
    concepto: "Apoyo a alumnos destacados",
    tipo: "Egreso",
    monto: 2500,
    categoria: "Beca",
    fecha: "2024-04-15",
  },
  {
    id: 14,
    concepto: "Recaudación por donaciones externas",
    tipo: "Ingreso",
    monto: 5200,
    categoria: "Donación",
    fecha: "2024-04-05",
  },
  {
    id: 15,
    concepto: "Pago renta de sonido para evento",
    tipo: "Egreso",
    monto: 900,
    categoria: "Evento",
    fecha: "2024-03-25",
  },
  {
    id: 16,
    concepto: "Venta de camisetas conmemorativas",
    tipo: "Ingreso",
    monto: 3400,
    categoria: "Merchandising",
    fecha: "2024-03-10",
  },
  {
    id: 17,
    concepto: "Pago electricidad oficina",
    tipo: "Egreso",
    monto: 680,
    categoria: "Servicios",
    fecha: "2024-02-28",
  },
  {
    id: 18,
    concepto: "Apoyo municipal a actividades escolares",
    tipo: "Ingreso",
    monto: 6000,
    categoria: "Apoyo",
    fecha: "2024-02-15",
  },
]);


  // 🔍 Búsqueda
  const handleSearch = () => {
    setSearch(searchInput);
  };

  const filteredFinanzas = finanzas.filter(
    (f) =>
      f.concepto.toLowerCase().includes(search.toLowerCase()) ||
      f.tipo.toLowerCase().includes(search.toLowerCase()) ||
      f.categoria.toLowerCase().includes(search.toLowerCase())
  );

  // 🗑️ Eliminar registro
  const handleDelete = (id) => {
    setFinanzas(finanzas.filter((f) => f.id !== id));
  };

  // ➕ Agregar registro
  const handleAdd = () => {
    setModoEdicion(false);
    setRegistroActual({
      concepto: "",
      tipo: "Ingreso",
      monto: "",
      categoria: "",
      fecha: "",
    });
    setShowModal(true);
  };

  // ✏️ Editar registro
  const handleEdit = (registro) => {
    setModoEdicion(true);
    setRegistroActual({ ...registro });
    setShowModal(true);
  };

  // 💾 Guardar registro
  const handleSave = (registro) => {
    if (modoEdicion) {
      setFinanzas(finanzas.map((f) => (f.id === registro.id ? registro : f)));
    } else {
      const nuevoRegistro = {
        ...registro,
        id: finanzas.length > 0 ? finanzas[finanzas.length - 1].id + 1 : 1,
      };
      setFinanzas([...finanzas, nuevoRegistro]);
    }
    setShowModal(false);
  };

  // 📊 Cálculos
  const totalIngresos = finanzas
    .filter((f) => f.tipo === "Ingreso")
    .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

  const totalEgresos = finanzas
    .filter((f) => f.tipo === "Egreso")
    .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

  const balance = totalIngresos - totalEgresos;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión Financiera</h1>
        <div className="flex gap-3">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            onClick={handleAdd}
          >
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar por concepto, tipo o categoría..."
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 hover:cursor-pointer"
        >
          Buscar
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Ingresos Totales"
          mainText={`$${totalIngresos}`}
          subText="Suma total de ingresos"
          onButtonClick={() => setDetalleTipo("Ingreso")}
        />
        <SummaryCard
          title="Egresos Totales"
          mainText={`$${totalEgresos}`}
          subText="Suma total de egresos"
          onButtonClick={() => setDetalleTipo("Egreso")}
        />
        <SummaryCard
          title="Balance General"
          mainText={`$${balance}`}
          subText={balance >= 0 ? "Superávit" : "Déficit"}
          onButtonClick={() => setDetalleTipo("Balance")}
        />
      </div>

      {/* Tabla de registros */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Concepto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Monto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Categoría</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFinanzas.map((f) => (
              <tr key={f.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{f.concepto}</td>
                <td
                  className={`px-4 py-3 text-sm font-medium ${
                    f.tipo === "Ingreso" ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {f.tipo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">${f.monto}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{f.categoria}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{f.fecha}</td>
                <td className="px-4 py-3 flex justify-center gap-3">
                  <button
                    onClick={() => handleEdit(f)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(f.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600">
          Mostrando {filteredFinanzas.length} de {finanzas.length} registros
        </div>
      </div>

      {/* Modal Detalle */}
      {detalleTipo && (
        <FinanzasDetalle
          tipo={detalleTipo}
          registros={finanzas}
          onClose={() => setDetalleTipo(null)}
        />
      )}

      {/* Modal de agregar/editar */}
      {showModal && (
        <FinanzasModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          registro={registroActual}
          modoEdicion={modoEdicion}
        />
      )}
    </div>
  );
}
