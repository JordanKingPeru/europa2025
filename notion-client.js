import { Client } from '@notionhq/client';
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const pageId = process.env.NOTION_PAGE_ID;

// Función para transformar los datos del itinerario al formato de Notion
const itineraryToNotionPage = (item) => ({
  parent: { database_id: process.env.NOTION_DATABASE_ID },
  properties: {
    Fecha: { date: { start: item.Fecha } },
    Ciudad: { title: [{ text: { content: item.Ciudad } }] },
    Actividad: { rich_text: [{ text: { content: item.Actividad } }] },
    Hora: { rich_text: [{ text: { content: item.Hora } }] },
    Notas: { rich_text: [{ text: { content: item.Notas } }] },
  },
});

// Función para crear la base de datos en Notion
export async function createDatabase() {
  console.log('Creando base de datos en Notion...');
  try {
    const response = await notion.databases.create({
      parent: { page_id: pageId },
      title: [{ text: { content: 'Itinerario Europa 2025' } }],
      properties: {
        Fecha: { date: {} },
        Ciudad: { title: {} },
        Actividad: { rich_text: {} },
        Hora: { rich_text: {} },
        Notas: { rich_text: {} },
      },
    });
    console.log('Base de datos creada con éxito!');
    // Guardar el ID de la nueva base de datos en el archivo .env
    const dbId = response.id;
    await fs.appendFile('.env', `\nNOTION_DATABASE_ID=${dbId}`);
    process.env.NOTION_DATABASE_ID = dbId;
    console.log('ID de la base de datos guardado en .env');
    return dbId;
  } catch (error) {
    console.error('Error al crear la base de datos:', error.body);
    throw error;
  }
}

// Función para añadir todos los items del itinerario a la base de datos
export async function populateDatabase(itineraryData) {
  console.log('Poblando la base de datos...');
  for (const item of itineraryData) {
    try {
      await notion.pages.create(itineraryToNotionPage(item));
    } catch (error) {
      console.error(`Error al añadir item ${item.Fecha}:`, error.body);
    }
  }
  console.log('Base de datos poblada con éxito.');
}

// Función para obtener el itinerario desde Notion
export async function getItinerary() {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error('NOTION_DATABASE_ID no está definido en el archivo .env');
  }
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
      sorts: [{ property: 'Fecha', direction: 'ascending' }],
    });

    // Mapear la respuesta de Notion a un formato de objeto más simple
    return response.results.map(page => ({
      Fecha: page.properties.Fecha.date?.start,
      Ciudad: page.properties.Ciudad.title[0]?.text.content,
      Actividad: page.properties.Actividad.rich_text[0]?.text.content,
      Hora: page.properties.Hora.rich_text[0]?.text.content,
      Notas: page.properties.Notas.rich_text[0]?.text.content,
    }));
  } catch (error) {
    console.error('Error al obtener el itinerario de Notion:', error.body);
    return [];
  }
} 