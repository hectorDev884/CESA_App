import React, { useState, useEffect } from "react";

export default function FinanzasModal({ onClose, onSave, registro, modoEdicion }) {
  // 🔹 Listas fijas de categorías
  const categoriasFijas = {
    Ingreso: [
      { nombre: "Cuotas de alumnos", descripcion: "Aportaciones semestrales o anuales de estudiantes" },
      { nombre: "Aportaciones del comité", descripcion: "Donaciones o cuotas internas de los miembros" },
      { nombre: "Donaciones externas", descripcion: "Apoyos de exalumnos, maestros o terceros" },
      { nombre: "Patrocinios", descripcion: "Apoyos económicos de empresas o negocios" },
      { nombre: "Venta de boletos", descripcion: "Ingreso por eventos sociales, culturales o deportivos" },
      { nombre: "Venta de comida o snacks", descripcion: "Ganancia de ventas en eventos o puntos fijos" },
      { nombre: "Venta de productos", descripcion: "Playeras, tazas, stickers u otros artículos" },
      { nombre: "Rifas y sorteos", descripcion: "Recaudación por venta de boletos de rifas" },
      { nombre: "Reembolsos", descripcion: "Devoluciones de fondos o pagos no usados" },
      { nombre: "Apoyos institucionales", descripcion: "Fondos otorgados por la escuela o facultad" },
      { nombre: "Servicios internos", descripcion: "Cobro por fotocopias, impresiones, etc." },
    ],
    Egreso: [
      { nombre: "Decoración y ambientación", descripcion: "Material para eventos o actividades" },
      { nombre: "Alimentos y bebidas", descripcion: "Compra de comida para eventos o reuniones" },
      { nombre: "Transporte", descripcion: "Gasolina o renta de vehículos para actividades" },
      { nombre: "Premios y reconocimientos", descripcion: "Medallas, trofeos o regalos" },
      { nombre: "Material de oficina", descripcion: "Papelería, carpetas, marcadores, etc." },
      { nombre: "Equipo y mantenimiento", descripcion: "Bocinas, proyectores, mobiliario, reparaciones" },
      { nombre: "Publicidad y difusión", descripcion: "Impresiones, carteles, redes sociales" },
      { nombre: "Becas o apoyos a alumnos", descripcion: "Ayudas económicas o materiales escolares" },
      { nombre: "Actividades culturales", descripcion: "Gastos de organización de ferias o talleres" },
      { nombre: "Actividades deportivas", descripcion: "Balones, uniformes, material deportivo" },
      { nombre: "Software o licencias", descripcion: "Herramientas digitales o suscripciones" },
      { nombre: "Renta de espacios", descripcion: "Pago de salones o lugares para eventos" },
      { nombre: "Limpieza y mantenimiento", descripcion: "Artículos de limpieza o servicio de apoyo" },
      { nombre: "Donaciones o causas sociales", descripcion: "Apoyos a campañas o colectas" },
      { nombre: "Gastos bancarios", descripcion: "Comisiones o mantenimiento de cuenta" },
      { nombre: "Emergencias e imprevistos", descripcion: "Cualquier gasto no planificado" },
    ],
  };

  const [formData, setFormData] = useState({
    concepto: "",
    tipo: "Ingreso",
    monto: "",
    categoria: "",
    descripcion: "",
    fecha: "",
  });

  useEffect(() => {
    if (registro) setFormData(registro);
  }, [registro]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // 🔸 Si cambia el tipo, reiniciamos la categoría y descripción
    if (name === "tipo") {
      setFormData({
        ...formData,
        tipo: value,
        categoria: "",
        descripcion: "",
      });
    } else if (name === "categoria") {
      const cat = categoriasFijas[formData.tipo].find((c) => c.nombre === value);
      setFormData({
        ...formData,
        categoria: value,
        descripcion: cat ? cat.descripcion : "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoriasDisponibles = categoriasFijas[formData.tipo];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
          {modoEdicion ? "Editar Registro Financiero" : "Nuevo Registro Financiero"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Concepto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Concepto</label>
            <input
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecciona una categoría</option>
              {categoriasDisponibles.map((c, index) => (
                <option key={index} value={c.nombre}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Descripción automática */}
          {formData.descripcion && (
            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm text-gray-700">
              <strong>Descripción: </strong> {formData.descripcion}
            </div>
          )}

          {/* Monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              {modoEdicion ? "Guardar Cambios" : "Agregar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
