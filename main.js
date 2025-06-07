import { viaje } from './data.js';

let itinerary = []; // El itinerario se cargará desde la API

// Auto-rellenar el resto del itinerario simulado
function fillItinerary(itinerary, viaje) {
  let fecha0 = new Date(viaje.inicio);
  let fecha1 = new Date(viaje.fin);
  let dias = (fecha1 - fecha0)/(1000*60*60*24)+1;
  let ciudades_vac = viaje.ciudades.slice(1);
  let actividades = [
    "Visita a museo de ciencias",
    "Día en la playa y castillos de arena",
    "Tour en bicicleta por la ciudad",
    "Espectáculo de marionetas",
    "Paseo en barco por el río",
    "Día de compras y helados",
    "Excursión al castillo local"
  ];
  let trabajoIni = new Date(viaje.trabajo_ini);
  let trabajoFin = new Date(viaje.trabajo_fin);
  for(let i=itinerary.length;i<dias;i++) {
    let d = new Date(fecha0.getTime() + i*24*3600*1000);
    let dayName = d.getDay();
    let fechaTxt = d.toISOString().slice(0,10);
    if(d>=trabajoIni && d<=trabajoFin && dayName>=1 && dayName<=5) {
      itinerary.push({
        "Fecha": fechaTxt,
        "Ciudad": "Madrid",
        "Actividad":"Trabajo en oficina BBVA (padres) / Escuela infantil (niña)",
        "Hora":"09:00 - 17:00",
        "Notas":"Tiempo libre por la tarde"
      });
    } else {
      let c = ciudades_vac[(i)%ciudades_vac.length];
      let a = actividades[(i)%actividades.length];
      itinerary.push({
        "Fecha": fechaTxt,
        "Ciudad": c,
        "Actividad": a,
        "Hora":"9:00 - 18:00",
        "Notas":"Plan ideal para familia"
      });
    }
  }
  return itinerary;
}
fillItinerary(itinerary, viaje);

// CALENDARIO MENSUAL CORREGIDO (semana comienza en LUNES)
function renderCalendars(itineraryData) {
  const start = new Date(viaje.inicio);
  const end = new Date(viaje.fin);
  let months = [];
  let d = new Date(start.getFullYear(), start.getMonth(), 1);
  let lastMonth = end.getMonth() + 12 * end.getFullYear();
  while (d.getMonth() + 12 * d.getFullYear() <= lastMonth) {
    months.push({ year: d.getFullYear(), month: d.getMonth() });
    d.setMonth(d.getMonth() + 1);
  }
  let html = "";
  months.forEach(m => {
    html += makeCalendar(m.year, m.month, viaje.inicio, viaje.fin, viaje.trabajo_ini, viaje.trabajo_fin, viaje.inicio, viaje.fin);
  });
  document.getElementById('calendars').innerHTML = html;
}

function makeCalendar(year, month, start, end, workStart, workEnd, inicio, regreso) {
  let wd = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  let first = new Date(year, month, 1);
  let last = new Date(year, month + 1, 0);
  let rows = [];
  let row = [];
  // Ajuste para que semana comience en lunes (en JavaScript getDay() 0=domingo, 1=lunes)
  let firstDayIndex = (first.getDay() + 6) % 7; // lunes=0
  for (let i = 0; i < firstDayIndex; i++) row.push({ day: "", type: "", isDay: false });

  for (let i = 1; i <= last.getDate(); i++) {
    let currentDayObj = new Date(year, month, i); // Usado para obtener el día de la semana local
    let currentDayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;

    let c = "";
    let isDay = false;

    if (currentDayStr < start || currentDayStr > end) {
      c = ""; // Día fuera del rango principal del viaje
    } else {
      isDay = true;
      if (currentDayStr === inicio) c = "start";
      else if (currentDayStr === regreso) c = "end";
      else {
        let dayOfWeek = currentDayObj.getDay(); // 0=Domingo, 1=Lunes, ..., 6=Sábado
        let isMonToFri = dayOfWeek >= 1 && dayOfWeek <= 5;

        if (currentDayStr >= workStart && currentDayStr <= workEnd && isMonToFri) {
          c = "workday";
        } else {
          c = "vacation";
        }
      }
    }
    row.push({ day: i, type: c, isDay });
    if (row.length === 7) {
      rows.push(row);
      row = [];
    }
  }
  if (row.length) while (row.length < 7) row.push({ day: "", type: "", isDay: false });
  if (row.length) rows.push(row);

  let title = first.toLocaleString("es-ES", { month: "long", year: "numeric" });
  let cal = `<div><div class="calendar-title">${title[0].toUpperCase() + title.slice(1)}</div>
  <table class="calendar"><tr>${wd.map(w => `<th>${w}</th>`).join("")}</tr>`;
  rows.forEach(r => {
    cal += "<tr>";
    r.forEach(cell => {
      let cls = cell.type ? cell.type : "";
      cal += `<td class="${cls.trim()}">${cell.day || ""}</td>`;
    });
    cal += "</tr>";
  });
  cal += "</table></div>";
  return cal;
}

// ==== RESUMEN DEL VIAJE ====
function resumenDelViaje(itineraryData) {
  let totalDias = itineraryData.length;
  let ciudades = new Set(itineraryData.map(d => d.Ciudad));
  let diasTrabajo = itineraryData.filter(d => d.Actividad && d.Actividad.startsWith("Trabajo")).length;
  let diasVacaciones = totalDias - diasTrabajo;
  let resumen = `
    <div style="margin-bottom:0.6rem"><strong>Familia:</strong> ${viaje.familia}</div>
    <div><strong>Fechas:</strong> ${new Date(viaje.inicio).toLocaleDateString("es-ES")} &rarr; ${new Date(viaje.fin).toLocaleDateString("es-ES")}</div>
    <div><strong>Días totales:</strong> ${totalDias}</div>
    <div><strong>Días de trabajo:</strong> ${diasTrabajo}</div>
    <div><strong>Días de vacaciones:</strong> ${diasVacaciones}</div>
    <div><strong>Ciudades visitadas:</strong> ${Array.from(ciudades).join(", ")}</div>
    <div><strong>Países:</strong> ${viaje.paises.join(", ")}</div>
  `;
  document.getElementById("summary").innerHTML = resumen;
}

// ==== ITINERARIO INTERACTIVO ====
function setupInteractiveItinerary(itineraryData) {
  let idx = 0;
  const itineraryDiv = document.getElementById("itinerary");
  const dayInfo = document.getElementById("dayInfo");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function renderDay(i) {
    let d = itineraryData[i];
    if (!d) return;
    itineraryDiv.innerHTML = `
      <div class="day-card">
        <div class="date">${new Date(d.Fecha).toLocaleDateString('es-ES', {weekday: 'long', year: 'numeric', month: 'short', day: 'numeric'})}</div>
        <div class="city">Ciudad: <b>${d.Ciudad || 'N/A'}</b></div>
        <div class="activity">Actividad: ${d.Actividad || 'Día libre'}</div>
        <div class="hour">Horario: ${d.Hora || '-'}</div>
        <div class="notes">${d.Notas || ''}</div>
      </div>
    `;
    dayInfo.textContent = `Día ${i + 1} de ${itineraryData.length}`;
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === itineraryData.length - 1;
  }

  prevBtn.onclick = () => {
    if (idx > 0) {
      idx--;
      renderDay(idx);
    }
  };
  nextBtn.onclick = () => {
    if (idx < itineraryData.length - 1) {
      idx++;
      renderDay(idx);
    }
  };
  renderDay(idx);
}

// --- FUNCIÓN PRINCIPAL DE INICIALIZACIÓN ---
async function initializeApp() {
  try {
    const response = await fetch('http://localhost:3000/api/itinerary');
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }
    itinerary = await response.json();
    
    if (!itinerary || itinerary.length === 0) {
      document.body.innerHTML = '<h1>No se pudo cargar el itinerario desde Notion.</h1><p>Asegúrate de que el servidor esté corriendo (`npm start`) y que la configuración de Notion sea correcta.</p>';
      return;
    }

    // Una vez que tenemos los datos, renderizamos todo
    renderCalendars(itinerary);
    resumenDelViaje(itinerary);
    setupInteractiveItinerary(itinerary);

  } catch (error) {
    console.error('Error al inicializar la aplicación:', error);
    document.body.innerHTML = `<h1>Error de Conexión</h1><p>No se pudo conectar con el servidor para obtener los datos del itinerario. Revisa la consola para más detalles.</p><p>Asegúrate de que el servidor esté corriendo en \`localhost:3000\` con el comando \`npm start\`.</p>`;
  }
}

// Iniciar la aplicación
initializeApp(); 