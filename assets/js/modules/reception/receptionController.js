import * as UI from './reception.ui.js';
import * as Service from './receptionService.js';
import { currentUser, hasRole } from '../common/auth.js';


export async function initReceptionModule() {
// Cargar vista
const view = UI.renderReceptionView();
const app = document.getElementById('app');
app.appendChild(view);


// Elementos
const listContainer = document.getElementById('room-list');
const detailsContainer = document.getElementById('room-details');


// Cargar habitaciones
const rooms = await Service.fetchRooms();
UI.renderRoomList(listContainer, rooms);


// Delegación de eventos
document.addEventListener('click', async (e) => {
const target = e.target;
if (target.matches('.view-room')) {
const id = target.dataset.id;
const room = await Service.getRoomById(id);
UI.renderRoomDetails(detailsContainer, room);
}


if (target.matches('.mark-clean')) {
const id = target.dataset.id;
const user = currentUser();
const res = await Service.markRoomClean(id, user.id);
if (res.ok) {
alert('Habitación marcada como limpia (online)');
} else {
alert('Habitación marcada como limpia (offline)');
}
// Refrescar lista
const updatedRooms = await Service.fetchRooms();
UI.renderRoomList(listContainer, updatedRooms);
}
if (target.matches('.report-incident')) {
const id = target.dataset.id;
const report = prompt('Describa el incidente:');
if (!report) return alert('Reporte cancelado');
const user = currentUser();
// Por simplicidad, no se maneja foto aquí
const res = await Service.reportIncident(id, report, user.id, null);
if (res.ok) {
alert('Incidente reportado (online)');
} else {
alert('Incidente reportado (offline)');
}
}
});
}   