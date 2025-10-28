// src/services/api_miembros.js
const API_BASE = 'http://localhost:5173/api';

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

// --- Miembros ---
export function getMembers(opts = {}) {
  const params = new URLSearchParams();
  if (opts.q) params.set('search', opts.q);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/miembros/${query}`);
}

export function getMember(nc) {
  return apiFetch(`/miembros/${nc}/`);
}

export function createMember(data) {
  return apiFetch('/miembros/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateMember(nc, data) {
  return apiFetch(`/miembros/${nc}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteMember(nc) {
  return apiFetch(`/miembros/${nc}/`, {
    method: 'DELETE',
  });
}

// --- Interacciones ---

// **FUNCIÓN CORREGIDA (AGREGADA)**
export function getAllInteractions(opts = {}) {
  const params = new URLSearchParams();
  // Lógica de búsqueda si es necesaria para todas las interacciones
  const query = params.toString() ? `?${params.toString()}` : '';
  // **Ajustar el endpoint si es diferente en tu API**
  return apiFetch(`/interacciones/${query}`);
}
// ------------------------------

export function getInteractions(nc, opts = {}) {
  const params = new URLSearchParams();
  if (opts.from) params.set('from_date', opts.from);
  if (opts.to) params.set('to_date', opts.to);
  const query = params.toString() ? `?${params.toString()}` : '';
  return apiFetch(`/miembros/${nc}/interacciones/${query}`);
}

export function addInteraction(nc, data) {
  return apiFetch(`/miembros/${nc}/interacciones/`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateInteraction(nc, interactionId, data) {
  return apiFetch(`/miembros/${nc}/interacciones/${interactionId}/`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteInteraction(nc, interactionId) {
  return apiFetch(`/miembros/${nc}/interacciones/${interactionId}/`, {
    method: 'DELETE',
  });
}

// --- Coordinaciones (utils) ---
export function getCoordinaciones() {
  return apiFetch('/coordinaciones/');
}

// --- Para desarrollo/testing ---
export function seedSampleData() {
  console.warn('seedSampleData() solo disponible en versión de desarrollo con localStorage');
}

export default {
  // Miembros
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  // Interacciones
  getAllInteractions, // **AGREGADO AL DEFAULT**
  getInteractions,
  addInteraction,
  updateInteraction,
  deleteInteraction,
  // Utils
  getCoordinaciones,
  seedSampleData,
};
