// src/services/api_becas_estudiante.js
const API_BASE = 'http://localhost:8000/api';
const API_PDF = ''


async function apiFetch(url, options = {}) {
  const response = await fetch(`${API_BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Error ${response.status}: ${errText}`);
  }

  return response.json();
}

export function getEstudiantes(query = "") { 
  const q = query ? `?${query}` : "";
  return apiFetch(`/estudiantes/${q}`);
}


export function createEstudiante(data) {
  return apiFetch('/estudiantes/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateEstudiante(id, data) {
  return apiFetch(`/estudiantes/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteEstudiante(id) {
  return apiFetch(`/estudiantes/${id}/`, {
    method: 'DELETE',
  });
}

export function getEstudiante(id) {
  return apiFetch(`/estudiantes/${id}/`);
}
// --- Becas ---
// ✅ getBecas ahora acepta query opcional para search/ordering
export function getBecas(query = "") {
  const q = query ? `?${query}` : "";
  return apiFetch(`/becas/${q}`);
}

export function getBeca(id) {
  return apiFetch(`/becas/${id}/`);
}

export function createBeca(data) {
  return apiFetch('/becas/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateBeca(id, data) {
  return apiFetch(`/becas/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteBeca(id) {
  return apiFetch(`/becas/${id}/`, {
    method: 'DELETE',
  });
}

export async function generarCalendario(data) {
  try {
    // 🔹 Esperamos la respuesta del backend
    const estudiante = await getEstudiante(data.nc); 
    const nombreCompleto = `${estudiante.nombre} ${estudiante.apellido}`;

    // 🔹 Construimos la URL con los parámetros GET
    const params = new URLSearchParams({
      nc: estudiante.numero_control,
      nombre: nombreCompleto,
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      color: data.color,
    });

    const response = await fetch(`http://localhost:8000/api/pdf/asistencia?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok || estudiante.becas.length === 0) {
      const errText = await response.text();
      throw new Error(`Error ${response.status}: ${errText}`);
    }

    // 🔹 Convertimos el PDF a blob
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // 🔹 Descarga automática
    const link = document.createElement("a");
    link.href = url;
    link.download = `calendario_${estudiante.numero_control}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("❌ Error generando calendario:", err);
    alert("Error al generar el PDF de asistencia.");
  }
}

export async function generarCalendarioGeneral(data) {
  try {
    const params = new URLSearchParams({
      fecha_inicio: data.fecha_inicio,
      fecha_fin: data.fecha_fin,
      // color: data.color,
    });

    const response = await fetch(`http://localhost:8000/api/pdf/asistencia_general/?${params.toString()}`, {
      method: "GET",
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Error ${response.status}: ${errText}`);
    }

    // Convertir PDF a blob y descargar
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `calendario_becas_actuales.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error("❌ Error generando PDF general:", err);
    alert("Error al generar el PDF de todas las becas.");
  }
}

