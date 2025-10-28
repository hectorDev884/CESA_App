import { describe, it, beforeEach, expect } from 'vitest';
import { createMember, getMembers, addInteraction, getInteractions, getAllInteractions, updateInteraction, deleteInteraction } from './api_miembros.js';

// Polyfill simple de localStorage para el entorno de pruebas (en caso de que no exista)
if (typeof globalThis.localStorage === 'undefined') {
  let _store = {};
  globalThis.localStorage = {
    getItem: (k) => (_store[k] === undefined ? null : _store[k]),
    setItem: (k, v) => { _store[k] = String(v); },
    removeItem: (k) => { delete _store[k]; },
    clear: () => { _store = {}; },
  };
}

beforeEach(() => {
  // limpiar el localStorage para pruebas aisladas
  localStorage.clear();
});

describe('api_miembros - interacciones (MVP)', () => {
  it('agrega, actualiza y elimina una interacción', async () => {
    // crear miembros necesarios
    await createMember({ numero_control: 'NC1', nombre: 'User1', apellido_paterno: '', apellido_materno: '', correo: 'u1@example.com', rol: 'Miembro', cargo: '', coordinacion: '' });
    await createMember({ numero_control: 'NC2', nombre: 'User2', apellido_paterno: '', apellido_materno: '', correo: 'u2@example.com', rol: 'Miembro', cargo: '', coordinacion: '' });

    const ts = '2025-10-28T10:00:00.000Z';
    // añadir interacción
    await addInteraction('NC1', { from: 'NC1', to: 'NC2', message: 'hola', timestamp: ts, tipo: 'Mensaje' });

    let list = await getInteractions('NC1');
    expect(list.length).toBe(1);
    expect(list[0].message).toBe('hola');

    // getAllInteractions debe devolverla también
    let all = await getAllInteractions();
    expect(all.length).toBe(1);

    // actualizar
    await updateInteraction('NC1', ts, { message: 'edited' });
    list = await getInteractions('NC1');
    expect(list[0].message).toBe('edited');

    // eliminar
    await deleteInteraction('NC1', ts);
    list = await getInteractions('NC1');
    expect(list.length).toBe(0);
  });
});
