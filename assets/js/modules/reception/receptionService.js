// assets/js/modules/reception/receptionService.js
try {
const res = await fetch(`${API_BASE}/rooms`);
if (!res.ok) throw new Error('fetch error');
const data = await res.json();
// Guardar copia en IDB
data.forEach(r => putItem('rooms', r));
return data;
} catch (err) {
// Modo offline
const offline = await getAll('rooms');
return offline;
}



export async function getRoomById(id) {
try {
const res = await fetch(`${API_BASE}/rooms/${id}`);
if (!res.ok) throw new Error('fetch error');
const r = await res.json();
await putItem('rooms', r);
return r;
} catch {
return await getItem('rooms', id);
}
}


export async function markRoomClean(id, userId) {
const payload = { action: 'mark_clean', roomId: id, userId, ts: Date.now() };
try {
const res = await fetch(`${API_BASE}/rooms/${id}/actions`, {
method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
});
if (!res.ok) throw new Error('server error');
const updated = await res.json();
await putItem('rooms', updated);
return { ok: true, room: updated };
} catch (err) {
// Guardar en pending para sincronizar después
await addPending(payload);
// Actualizar localmente el status en IDB (optimista)
const local = await getItem('rooms', id) || { id };
local.status = 'clean';
await putItem('rooms', local);
return { ok: false, offline: true, room: local };
}
}


export async function reportIncident(id, report, userId, photoBlob) {
const payload = { action: 'report_incident', roomId: id, userId, report, ts: Date.now() };
try {
// Si hay foto, usar FormData
const fd = new FormData();
fd.append('metadata', JSON.stringify(payload));
if (photoBlob) fd.append('photo', photoBlob, 'incident.jpg');
const res = await fetch(`${API_BASE}/rooms/${id}/incidents`, { method: 'POST', body: fd });
if (!res.ok) throw new Error('server error');
const updated = await res.json();
await putItem('rooms', updated.room);
return { ok: true, data: updated };
} catch (err) {
// Guardar en pending (sin la foto binaria — podrías guardar la foto en IndexedDB Blob)
await addPending({ ...payload, offlinePhoto: null });
const local = await getItem('rooms', id) || { id };
local.status = 'blocked';
await putItem('rooms', local);
return { ok: false, offline: true };
}
}