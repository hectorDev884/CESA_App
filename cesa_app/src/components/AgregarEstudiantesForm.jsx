import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEstudiante } from "../services/api_becas_estudiante.js"; // importa tu función de API

export default function EstudianteForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        numero_control: "",
        nombre: "",
        apellido: "",
        email: "",
        carrera: "Ing. Informatica",
        semestre: "7",
        telefono: "",
        fecha_registro: new Date().toISOString().split("T")[0],
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.numero_control || !formData.nombre || !formData.apellido || !formData.email) {
            alert("Por favor completa todos los campos requeridos.");
            return;
        }

        try {
            setLoading(true);
            await createEstudiante(formData); // Llamada a la API
            alert("Estudiante creado correctamente.");
            navigate("/estudiantes"); // Regresa a la lista
        } catch (err) {
            console.error("❌ Error al crear estudiante:", err);
            alert("Ocurrió un error al crear el estudiante.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-6 mt-10 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Agregar Estudiante</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Control</label>
                    <input
                        type="text"
                        name="numero_control"
                        value={formData.numero_control}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input
                            type="text"
                            name="apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Carrera</label>
                    <input
                        type="text"
                        name="carrera"
                        value={formData.carrera}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Semestre</label>
                    <select
                        name="semestre"
                        value={formData.semestre}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {[...Array(12)].map((_, i) => (
                            <option key={i + 1} value={String(i + 1)}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 hover:cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:cursor-pointer"
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
