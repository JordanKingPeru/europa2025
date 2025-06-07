import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getItinerary } from './notion-client.js';

dotenv.config();

const app = express();
const port = 3000;

// Habilitar CORS para permitir que el frontend se comunique con este servidor
app.use(cors());

// Endpoint para obtener los datos del itinerario
app.get('/api/itinerary', async (req, res) => {
  try {
    const itinerary = await getItinerary();
    res.json(itinerary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos de Notion' });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
  console.log('Ahora puedes abrir tu archivo index.html en el navegador.');
}); 