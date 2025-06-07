# Itinerario Viaje Europa 2025 (conectado a Notion)

Este proyecto es una aplicación web para visualizar el itinerario de un viaje familiar, con la particularidad de que carga todos los datos desde una base de datos de Notion.

## Características

*   **Conexión con Notion**: El itinerario se gestiona completamente desde una base de datos en Notion.
*   **Visualización de Itinerario Interactivo**: Navega día por día para ver las actividades planificadas.
*   **Calendario Mensual**: Muestra calendarios destacando los días de trabajo y vacaciones.
*   **Resumen del Viaje**: Proporciona un resumen con información clave del viaje.
*   **Backend y Frontend separados**: Una arquitectura más robusta con un servidor Node.js que se comunica con Notion.

## Estructura del Proyecto

*   `index.html`: Estructura de la página web (frontend).
*   `styles.css`: Estilos del frontend.
*   `main.js`: Lógica del frontend (pide los datos al backend y renderiza la UI).
*   `data.js`: Almacena la configuración estática del viaje.
*   `server.js`: Servidor backend (Node.js/Express) que se conecta a Notion.
*   `notion-client.js`: Módulo que gestiona la comunicación con la API de Notion.
*   `setup-notion.js`: Script para configurar la base de datos de Notion por primera vez.
*   `package.json`: Dependencias y scripts del proyecto.

## Cómo usarlo

### Requisitos

*   Node.js (v16 o superior).
*   Una cuenta de Notion.

### 1. Configuración de Notion

1.  **Crea una Integración de Notion**:
    *   Ve a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations).
    *   Haz clic en "+ New integration". Dale un nombre (ej. "Itinerario App") y asígnale el "Workspace" correcto.
    *   Copia el **Internal Integration Token**. Esta es tu `NOTION_API_KEY`.

2.  **Crea una Página en Notion**:
    *   Crea una página nueva y vacía en tu workspace de Notion.
    *   Copia el ID de la página desde la URL. Si la URL es `notion.so/My-Page-Title-a1b2c3d4e5f6...`, el ID es `a1b2c3d4e5f6...`. Este es tu `NOTION_PAGE_ID`.

3.  **Comparte la Página con la Integración**:
    *   En la página que creaste, ve a `Share` (arriba a la derecha) y, en el campo de invitar, selecciona la integración que creaste en el paso 1.

### 2. Configuración del Proyecto Local

1.  **Clona o descarga este repositorio.**

2.  **Crea tu archivo de entorno**:
    *   Renombra el archivo `env.txt` a `.env`.
    *   Abre el archivo `.env` y pega tus credenciales:
        ```
        NOTION_API_KEY="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        NOTION_PAGE_ID="a1b2c3d4e5f67890a1b2c3d4e5f67890"
        ```

3.  **Instala las dependencias**:
    ```bash
    npm install
    ```

### 3. Crear y Poblar la Base de Datos de Notion

Ejecuta el siguiente comando **una sola vez**. Este script creará la base de datos en tu página de Notion y la llenará con los datos del viaje.

```bash
npm run setup
```

Después de ejecutarlo, tu archivo `.env` se actualizará automáticamente con el nuevo `NOTION_DATABASE_ID`.

### 4. Ejecutar la Aplicación

1.  **Inicia el servidor backend**:
    ```bash
    npm start
    ```
    El servidor se ejecutará en `http://localhost:3000`.

2.  **Abre el frontend**:
    *   Abre el archivo `index.html` en tu navegador.

La página cargará los datos desde tu servidor y los mostrará. ¡Cualquier cambio que hagas en la base de datos de Notion se reflejará la próxima vez que cargues la página!
