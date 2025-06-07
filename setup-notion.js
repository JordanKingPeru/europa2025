import { createDatabase, populateDatabase } from './notion-client.js';
import { itinerary as localItinerary, viaje } from './data.js';

// Esta función genera el itinerario completo, igual que en el frontend original
function fillItinerary(itinerary, viajeConfig) {
  const filledItinerary = [...itinerary]; // Copia para no modificar el original
  let fecha0 = new Date(viajeConfig.inicio);
  let fecha1 = new Date(viajeConfig.fin);
  let dias = (fecha1 - fecha0) / (1000 * 60 * 60 * 24) + 1;
  let ciudades_vac = viajeConfig.ciudades.slice(1);
  let actividades = [
    "Visita a museo de ciencias",
    "Día en la playa y castillos de arena",
    "Tour en bicicleta por la ciudad",
    "Espectáculo de marionetas",
    "Paseo en barco por el río",
    "Día de compras y helados",
    "Excursión al castillo local"
  ];
  let trabajoIni = new Date(viajeConfig.trabajo_ini);
  let trabajoFin = new Date(viajeConfig.trabajo_fin);

  const existingDates = new Set(filledItinerary.map(item => item.Fecha));

  for (let i = 0; i < dias; i++) {
    let d = new Date(fecha0.getTime() + i * 24 * 3600 * 1000);
    let fechaTxt = d.toISOString().slice(0, 10);

    if (existingDates.has(fechaTxt)) {
      continue; // Si la fecha ya existe en los datos iniciales, la saltamos
    }
    
    let dayName = d.getDay();
    if (d >= trabajoIni && d <= trabajoFin && dayName >= 1 && dayName <= 5) {
      filledItinerary.push({
        "Fecha": fechaTxt,
        "Ciudad": "Madrid",
        "Actividad": "Trabajo en oficina BBVA (padres) / Escuela infantil (niña)",
        "Hora": "09:00 - 17:00",
        "Notas": "Tiempo libre por la tarde"
      });
    } else {
      let c = ciudades_vac[i % ciudades_vac.length];
      let a = actividades[i % actividades.length];
      filledItinerary.push({
        "Fecha": fechaTxt,
        "Ciudad": c,
        "Actividad": a,
        "Hora": "9:00 - 18:00",
        "Notas": "Plan ideal para familia"
      });
    }
  }
  return filledItinerary.sort((a, b) => new Date(a.Fecha) - new Date(b.Fecha));
}


async function main() {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_PAGE_ID) {
    console.error('Por favor, asegúrate de que NOTION_API_KEY y NOTION_PAGE_ID están en tu archivo .env');
    return;
  }
  
  try {
    const fullItinerary = fillItinerary(localItinerary, viaje);
    await createDatabase();
    await populateDatabase(fullItinerary);
    console.log('\n¡Setup completado! Tu base de datos de Notion está lista.');
    console.log('Ahora puedes arrancar el servidor con: npm start');
  } catch (err) {
    console.error('Ha ocurrido un error durante el setup:', err);
  }
}

main(); 