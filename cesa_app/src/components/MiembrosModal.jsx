// src/components/MiembrosModal.jsx
import React, { useEffect, useState } from "react";

// Estilos para campos deshabilitados
const inputDisabledStyles = "w-full p-2 border rounded bg-gray-100 cursor-not-allowed"; 

/**
 * Props:
 * - tipoModal: "agregarMiembro" | "editarMiembro" | "buscarMiembro" | "agregarInteraccion" | "editarInteraccion"
 * - initialData: objeto con datos para editar (miembro o interaccion)
 * - onClose: fn
 * - onAgregarMiembro, onEditarMiembro, onBuscarMiembro, onAgregarInteraccion, onEditarInteraccion
 * - miembros: lista de miembros (para select de miembro en interacciones)
 * - numerosControlPermitidos: lista de strings de todos los estudiantes (DESDE SUPABASE)
 * - datosEstudiantes: [ {numero_control, nombre, apellido, ...} ]
 */
export default function MiembrosModal({
    tipoModal,
    initialData,
    onClose,
    onAgregarMiembro,
    onEditarMiembro,
    onBuscarMiembro,
    onAgregarInteraccion,
    onEditarInteraccion,
    miembros = [],
    numerosControlPermitidos = [], 
    datosEstudiantes = [], 
}) {
    // Form state general
    const [form, setForm] = useState({});

    // Inicializar el estado del formulario o resetear
    useEffect(() => {
        if (tipoModal === "agregarMiembro") {
            // Valores iniciales para Agregar Miembro
            setForm({
                numero_control: '',
                nombre: '',
                apellido: '',
                email: '',
                carrera: '',
                semestre: '',
                telefono: '',
                cargo: '',
            });
        } else if (tipoModal === "editarInteraccion" && initialData) { 
            // 🔑 AJUSTE 1: Formatear la fecha para la edición de interacciones
            const fechaFormateada = initialData.fecha 
                ? initialData.fecha.slice(0, 10) 
                : new Date().toISOString().slice(0, 10);
            
            setForm({ 
                ...initialData,
                fecha: fechaFormateada
            });
        } else if (initialData) {
            setForm({ ...initialData });
        } else {
            setForm({});
        }
    }, [initialData, tipoModal]);

    // Función para autocompletar y deshabilitar (Solo en Agregar Miembro)
    const handleNumeroControlChange = (e) => {
        const nc = e.target.value;
        
        // 1. Actualizar el Número de Control
        setForm(prev => ({ ...prev, numero_control: nc }));

        // 2. Buscar si el NC existe en los datos completos
        const estudianteEncontrado = datosEstudiantes.find(
            (e) => e.numero_control === nc
        );

        if (estudianteEncontrado) {
            // 3. Si se encuentra, AUTOCLMPLETAR y SOBREESCRIBIR el resto del formulario
            setForm(prev => ({
                ...prev,
                numero_control: estudianteEncontrado.numero_control,
                nombre: estudianteEncontrado.nombre || '',
                apellido: estudianteEncontrado.apellido || '',
                email: estudianteEncontrado.email || '',
                carrera: estudianteEncontrado.carrera || '',
                semestre: estudianteEncontrado.semestre || '',
                telefono: estudianteEncontrado.telefono || '',
            }));
        } else {
            // 4. Si no se encuentra o se selecciona el valor vacío, LIMPIAR los campos
            setForm(prev => ({
                ...prev,
                nombre: '',
                apellido: '',
                email: '',
                carrera: '',
                semestre: '',
                telefono: '',
            }));
        }
    };
    
    // Función para manejar cambios en el resto de los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Guardar según tipo
    const handleGuardar = () => {
        if (tipoModal === "agregarMiembro") {
            // Validaciones
            if (!form.numero_control || !form.nombre) {
                alert("Selecciona un número de control válido para autocompletar los datos.");
                return;
            }
            if (!form.cargo) {
                alert("Selecciona un cargo para el miembro.");
                return;
            }
            // Validar que el NC no sea ya un miembro
            if (miembros.some(m => m.numero_control === form.numero_control)) {
                 alert("Este número de control ya está registrado como miembro.");
                 return;
            }

            // Enviamos el formulario autocompletado (solo los campos necesarios)
            onAgregarMiembro({
                numero_control: form.numero_control,
                nombre: form.nombre || "",
                apellido: form.apellido || "",
                email: form.email || "",
                carrera: form.carrera || "",
                semestre: form.semestre ? Number(form.semestre) : null,
                telefono: form.telefono || "",
                cargo: form.cargo || "",
            });
        } else if (tipoModal === "editarMiembro") {
            if (!initialData || !initialData.numero_control) {
                alert("No se pudo editar: datos incompletos.");
                return;
            }
            // Aquí los campos *no* están deshabilitados, se editan normalmente
            const cambios = {
                nombre: form.nombre || "",
                apellido: form.apellido || "",
                email: form.email || "",
                carrera: form.carrera || "",
                semestre: form.semestre ? Number(form.semestre) : null,
                telefono: form.telefono || "",
                cargo: form.cargo || "",
            };
            onEditarMiembro(initialData.numero_control, cambios);
        } else if (tipoModal === "buscarMiembro") {
            if (!form.numero_control) {
                alert("Ingresa el número de control a buscar.");
                return;
            }
            onBuscarMiembro(form.numero_control);
        } else if (tipoModal === "agregarInteraccion") {
            // Validaciones básicas
            if (!form.tipo || !form.tema || !form.miembro_id || !form.fecha) {
                alert("Tipo, tema, miembro y fecha son obligatorios.");
                return;
            }
            const nueva = {
                miembro_id: form.miembro_id,
                tipo: form.tipo,
                tema: form.tema,
                descripcion: form.descripcion || "",
                fecha: form.fecha, // Ya está en formato YYYY-MM-DD
            };
            onAgregarInteraccion(nueva);
        } else if (tipoModal === "editarInteraccion") {
            if (!initialData || typeof initialData.id === "undefined") {
                alert("No se pudo editar: datos incompletos.");
                return;
            }
            // 🔑 AJUSTE 2: Enviamos el estado 'form' completo para que Supabase lo actualice.
            const { id, ...cambios } = form; // Extraemos el ID, el resto son los cambios

            // Validación de campos NOT NULL antes de enviar
            if (!cambios.tipo || !cambios.tema || !cambios.miembro_id || !cambios.fecha) {
                alert("Tipo, tema, miembro y fecha son obligatorios para editar la interacción.");
                return;
            }
            
            // Enviamos el ID original de initialData.
            onEditarInteraccion(initialData.id, cambios); 
        }
    };

    // Títulos según modal
    const titulo =
        tipoModal === "agregarMiembro"
            ? "Agregar Miembro (Autocompletado)"
            : tipoModal === "editarMiembro"
            ? "Editar Miembro"
            : tipoModal === "buscarMiembro"
            ? "Buscar Miembro"
            : tipoModal === "agregarInteraccion"
            ? "Agregar Interacción"
            : tipoModal === "editarInteraccion"
            ? "Editar Interacción"
            : "";

    // Opciones para tipos y temas (mantenido)
    const cargos = [
        "Presidente",
        "Secretario",
        "Tesorero",
        "Coordinador",
        "Vocal",
        "Miembro",
    ];
    const tipos = [
        "Reunión presencial",
        "Llamada telefónica",
        "Videollamada",
        "Mensaje",
        "Seguimiento",
        "Visita",
        "Evento grupal",
        "Asesoría individual",
        "Encuentro informal",
        "Otro",
    ];
    const temas = [
        "Bienvenida / Integración",
        "Seguimiento de actividades",
        "Desempeño o participación",
        "Resolución de conflictos",
        "Motivación personal",
        "Organización de eventos",
        "Retroalimentación / evaluación",
        "Capacitación / formación",
        "Apoyo académico o profesional",
        "Actualización de datos",
        "Avisos o recordatorios",
        "Propuesta de mejora",
        "Revisión de objetivos",
        "Planificación futura",
        "Otro",
    ];
    
    // Lógica para deshabilitar el botón de agregar
    const ncSeleccionadoYDatosCompletos = form.numero_control && form.nombre; 
    const yaEsMiembro = miembros.some(m => m.numero_control === form.numero_control);
    const puedeAgregar = tipoModal === "agregarMiembro" && ncSeleccionadoYDatosCompletos && form.cargo && !yaEsMiembro;
    

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
                >
                    ✖
                </button>

                <h2 className="text-2xl font-bold text-center mb-4">{titulo}</h2>

                {/* Formulario */}
                <div className="space-y-3">
                    {(tipoModal === "agregarMiembro" || tipoModal === "editarMiembro") && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Numero control - ÚNICO CAMPO NO DESHABILITADO EN 'AGREGAR MIEMBRO' */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de control
                                </label>
                                {tipoModal === "agregarMiembro" ? (
                                    <select
                                        name="numero_control"
                                        value={form.numero_control || ""}
                                        onChange={handleNumeroControlChange} 
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Selecciona número de control</option>
                                        {numerosControlPermitidos.map((n) => (
                                            <option key={n} value={n}>
                                                {n}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    // edición: no permitir cambiar número de control
                                    <input
                                        type="text"
                                        name="numero_control"
                                        value={initialData?.numero_control || ""}
                                        readOnly
                                        className={inputDisabledStyles}
                                    />
                                )}
                            </div>

                            {/* Semestre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Semestre
                                </label>
                                <input
                                    type="number"
                                    name="semestre"
                                    value={form.semestre ?? ""}
                                    onChange={handleChange}
                                    className={tipoModal === "agregarMiembro" ? inputDisabledStyles : "w-full p-2 border rounded"}
                                    disabled={tipoModal === "agregarMiembro"} 
                                />
                            </div>

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={form.nombre ?? ""}
                                    onChange={handleChange}
                                    className={tipoModal === "agregarMiembro" ? inputDisabledStyles : "w-full p-2 border rounded"}
                                    disabled={tipoModal === "agregarMiembro"} 
                                />
                            </div>

                            {/* Cargo */}
                            {(tipoModal === "agregarMiembro" || tipoModal === "editarMiembro") && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Cargo
                                    </label>
                                    <select
                                        name="cargo"
                                        value={form.cargo ?? ""}
                                        onChange={handleChange}
                                        className={tipoModal === "agregarMiembro" ? "w-full p-2 border rounded" : "w-full p-2 border rounded"}
                                    >
                                        <option value="">Selecciona cargo</option>
                                        {cargos.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Apellido */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellidos
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    value={form.apellido ?? ""}
                                    onChange={handleChange}
                                    className={tipoModal === "agregarMiembro" ? inputDisabledStyles : "w-full p-2 border rounded"}
                                    disabled={tipoModal === "agregarMiembro"} 
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email ?? ""}
                                    onChange={handleChange}
                                    className={tipoModal === "agregarMiembro" ? inputDisabledStyles : "w-full p-2 border rounded"}
                                    disabled={tipoModal === "agregarMiembro"} 
                                />
                            </div>

                            {/* Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <input
                                    type="text"
                                    name="telefono"
                                    value={form.telefono ?? ""}
                                    onChange={handleChange}
                                    className={tipoModal === "agregarMiembro" ? inputDisabledStyles : "w-full p-2 border rounded"}
                                    disabled={tipoModal === "agregarMiembro"} 
                                />
                            </div>

                            {/* Carrera */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Carrera
                                </label>
                                <input
                                    type="text"
                                    name="carrera"
                                    value={form.carrera ?? ""}
                                    onChange={handleChange}
                                    className={tipoModal === "agregarMiembro" ? inputDisabledStyles : "w-full p-2 border rounded"}
                                    disabled={tipoModal === "agregarMiembro"} 
                                />
                            </div>
                        </div>
                    )}

                    {/* Mensajes de feedback para Agregar Miembro */}
                    {tipoModal === "agregarMiembro" && yaEsMiembro && (
                        <p className="text-red-600 font-medium">Este número de control ya está registrado como miembro.</p>
                    )}
                    {tipoModal === "agregarMiembro" && form.numero_control && !form.nombre && !yaEsMiembro && (
                        <p className="text-yellow-600 font-medium">Selecciona un número de control válido de la lista para autocompletar.</p>
                    )}

                    {tipoModal === "buscarMiembro" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Número de control a buscar
                            </label>
                            <input
                                type="text"
                                name="numero_control"
                                value={form.numero_control ?? ""}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                placeholder="Ej. 1234"
                            />
                        </div>
                    )}

                    {(tipoModal === "agregarInteraccion" || tipoModal === "editarInteraccion") && (
                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo
                                </label>
                                <select
                                    name="tipo"
                                    value={form.tipo ?? ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Selecciona tipo</option>
                                    {tipos.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:flex md:gap-3">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fecha
                                    </label>
                                    <input
                                        type="date"
                                        name="fecha"
                                        value={form.fecha ?? new Date().toISOString().slice(0, 10)}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tema
                                    </label>
                                    <select
                                        name="tema"
                                        value={form.tema ?? ""}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                    >
                                        <option value="">Selecciona tema</option>
                                        {temas.map((t) => (
                                            <option key={t} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={form.descripcion ?? ""}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Miembro (Número de control)
                                </label>
                                <select
                                    name="miembro_id"
                                    value={form.miembro_id ?? ""}
                                    onChange={handleChange}
                                    // 🔑 AJUSTE 3: Deshabilitar la edición del miembro asociado
                                    className={`w-full p-2 border rounded ${tipoModal === "editarInteraccion" ? inputDisabledStyles : ""}`} 
                                    disabled={tipoModal === "editarInteraccion"} 
                                >
                                    <option value="">Selecciona miembro</option>
                                    {miembros.map((m) => (
                                        <option key={m.numero_control} value={m.numero_control}>
                                            {m.numero_control} — {m.nombre} {m.apellido}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Botones */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleGuardar}
                        className={`text-white px-4 py-2 rounded ${
                            tipoModal === "agregarMiembro" && !puedeAgregar
                                ? "bg-gray-400 cursor-not-allowed" 
                                : "bg-[#036942] hover:bg-green-700"
                        }`}
                        disabled={tipoModal === "agregarMiembro" && !puedeAgregar}
                    >
                        {tipoModal === "buscarMiembro" ? "Buscar" : "Guardar"}
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
