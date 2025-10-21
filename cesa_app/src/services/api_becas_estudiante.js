// src/services/api.js
const API_BASE = 'http://localhost:8000/api';

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

// --- Students ---
export function getEstudiantes() {
  return apiFetch('/estudiantes/');
}

export function getEstudiante(id) {
  return apiFetch(`/estudiantes/${id}/`);
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

// --- Becas ---
export function getBecas() {
  return apiFetch('/becas/');
}

export function createBeca(data) {
  return apiFetch('/becas/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
