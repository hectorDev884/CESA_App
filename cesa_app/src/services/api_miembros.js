// Servicio simple que usa localStorage para simular un backend de miembros e interacciones
const MEMBERS_KEY = "cesa_members_v1";
const INTERACTIONS_KEY = "cesa_interactions_v1";

function readMembers() {
  try {
    const raw = localStorage.getItem(MEMBERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

function writeMembers(list) {
  localStorage.setItem(MEMBERS_KEY, JSON.stringify(list));
}

function readInteractions() {
  try {
    const raw = localStorage.getItem(INTERACTIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error(e);
    return {};
  }
}

function writeInteractions(obj) {
  localStorage.setItem(INTERACTIONS_KEY, JSON.stringify(obj));
}

export async function getMembers(opts) {
  // opts.q puede ser una cadena de búsqueda
  const all = readMembers();
  if (!opts || !opts.q) return all;
  const q = opts.q.toLowerCase();
  return all.filter(
    (m) =>
      (m.numero_control && m.numero_control.toLowerCase().includes(q)) ||
      (m.nombre && m.nombre.toLowerCase().includes(q)) ||
      (m.correo && m.correo.toLowerCase().includes(q)) ||
      (m.rol && m.rol.toLowerCase().includes(q)) ||
      (m.coordinacion && m.coordinacion.toLowerCase().includes(q))
  );
}

export async function createMember(member) {
  const all = readMembers();
  // validar NC único
  if (all.some((m) => m.numero_control === member.numero_control)) {
    throw new Error("Número de control ya registrado");
  }
  all.push(member);
  writeMembers(all);
  return member;
}

export async function updateMember(nc, newData) {
  const all = readMembers();
  const idx = all.findIndex((m) => m.numero_control === nc);
  if (idx === -1) throw new Error("Miembro no encontrado");
  all[idx] = { ...all[idx], ...newData };
  writeMembers(all);
  return all[idx];
}

export async function deleteMember(nc) {
  const all = readMembers();
  const filtered = all.filter((m) => m.numero_control !== nc);
  writeMembers(filtered);
  // eliminar interacciones asociadas
  const interactions = readInteractions();
  delete interactions[nc];
  writeInteractions(interactions);
  return true;
}

export async function getInteractions(nc) {
  const interactions = readInteractions();
  return interactions[nc] || [];
}

export async function getAllInteractions() {
  const interactions = readInteractions();
  // interactions is an object { nc: [it, ...], ... }
  const all = [];
  Object.keys(interactions).forEach((nc) => {
    const arr = interactions[nc] || [];
    arr.forEach((it) => all.push({ from: nc, ...it }));
  });
  // sort por timestamp descendente
  all.sort((a, b) => {
    const ta = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const tb = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return tb - ta;
  });
  return all;
}

export async function addInteraction(nc, interaction) {
  const interactions = readInteractions();
  if (!interactions[nc]) interactions[nc] = [];
  // if interaction already has timestamp, preserve; else generate one
  const it = { ...interaction, timestamp: interaction.timestamp || new Date().toISOString() };
  interactions[nc].push(it);
  writeInteractions(interactions);
  return interactions[nc];
}

export async function updateInteraction(nc, timestamp, newInteraction) {
  const interactions = readInteractions();
  if (!interactions[nc]) throw new Error("No hay interacciones para este miembro");
  const idx = interactions[nc].findIndex((it) => it.timestamp === timestamp);
  if (idx === -1) throw new Error("Interacción no encontrada");
  // preserve timestamp unless newInteraction has one
  interactions[nc][idx] = { ...interactions[nc][idx], ...newInteraction, timestamp: newInteraction.timestamp || interactions[nc][idx].timestamp };
  writeInteractions(interactions);
  return interactions[nc][idx];
}

export async function deleteInteraction(nc, timestamp) {
  const interactions = readInteractions();
  if (!interactions[nc]) return false;
  const filtered = interactions[nc].filter((it) => it.timestamp !== timestamp);
  interactions[nc] = filtered;
  writeInteractions(interactions);
  return true;
}

// utilidad para inicializar con datos de ejemplo (solo para desarrollo)
export function seedSampleData() {
  const existing = readMembers();
  if (existing.length) return;
  const sample = [
    {
      numero_control: "NC001",
      nombre: "Luis",
      apellido_paterno: "García",
      apellido_materno: "Pérez",
      correo: "luis@example.com",
      rol: "Miembro",
      cargo: "Analista",
      coordinacion: "Finanzas",
    },
    {
      numero_control: "NC002",
      nombre: "Ana",
      apellido_paterno: "López",
      apellido_materno: "Ruiz",
      correo: "ana@example.com",
      rol: "Coordinador",
      cargo: "Coordinador",
      coordinacion: "Operaciones",
    },
  ];
  writeMembers(sample);
}

export default {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getInteractions,
  addInteraction,
  seedSampleData,
};
