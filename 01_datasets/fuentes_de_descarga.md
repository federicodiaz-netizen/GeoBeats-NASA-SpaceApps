# 🛰️ Guía de Descarga: Dónde y Cómo Obtener las Imágenes del EIC

Para la **Jukebox Terrestre**, la NASA recomienda explícitamente las fuentes oficiales del **Earth Information Center (EIC)**. A continuación tienes las 4 fuentes exactas, ordenadas de la más fácil y rápida (ideal para 1 hora) a las más avanzadas.

---

## 🥇 Opción 1: earth.gov (Portal Oficial del EIC) — *LA MÁS RECOMENDADA*
El portal oficial del Earth Information Center es:
👉 **[earth.gov](https://earth.gov)**

### Cómo sacar las imágenes:
1. Entra a **[earth.gov](https://earth.gov)** y ve a la sección de temas (Temas: *Greenhouse Gases*, *Sea Level Change*, *Wildfires*, *Air Quality*).
2. Abre cualquier visualizador interactivo a pantalla completa.
3. Puedes hacer **captura de pantalla limpia** o clic derecho -> *Guardar imagen como...* de los fotogramas y mapas de calor.

---

## 🥈 Opción 2: NASA Scientific Visualization Studio (SVS) — *ALTA CALIDAD & ANIMACIONES*
El SVS es el estudio científico que crea todos los videos y cuadros visuales que se proyectan en las pantallas gigantes del EIC.
👉 **[svs.gsfc.nasa.gov](https://svs.gsfc.nasa.gov)**

### Búsquedas directas ideales para el reto:
- **Temperatura Global:** Busca *"Global Temperature Anomalies"* o *"GISTEMP"* (obtendrás mapas con gradientes claros de azul a rojo brillante).
- **Corrientes Oceánicas:** Busca *"Perpetual Ocean"* (visualización histórica de corrientes con fluidos cian/azul).
- **Emisiones de CO₂:** Busca *"A Global View of CO2"* (nubes densas de dióxido de carbono en movimiento).

*Ventaja:* En cada página de SVS hay un botón de **"Download"** que te permite descargar imágenes fijas en `.png` / `.jpg` o secuencias de fotogramas en máxima resolución.

---

## 🥉 Opción 3: NASA Worldview — *SATÉLITE EN VIVO Y TIEMPO REAL*
Herramienta interactiva para ver la Tierra como la ven los satélites hoy mismo.
👉 **[worldview.earthdata.nasa.gov](https://worldview.earthdata.nasa.gov)**

### Cómo usarla en 2 pasos:
1. En el panel izquierdo ("Add Layers"), activa capas de alto contraste como:
   - *Fires and Thermal Anomalies* (Incendios / Focos rojos).
   - *Sea Surface Temperature* (Temperatura del océano).
   - *Chlorophyll* (Concentración de fitoplancton en océanos).
2. Arriba a la derecha, haz clic en el ícono de **Cámara 📷 (Snapshot)** para descargar el mapa recortado como imagen PNG al instante.

---

## 🏅 Opción 4: NASA Earth Observatory
👉 **[earthobservatory.nasa.gov](https://earthobservatory.nasa.gov)**
- Tienen la sección **"Global Maps"** donde cada mapa viene con su barra de calibración de colores ya estandarizada (ideal para mapear color exacto a nota musical).

---

## 💡 Consejo Clave para el Hackathon de 1 Hora:
**No pierdas 20 minutos navegando en internet durante la hackatón.** 
El facilitador o el equipo debe descargar **3 a 5 imágenes clave antes de comenzar la sesión de 60 minutos** y guardarlas directamente dentro de la carpeta:
👉 [`01_datasets/`](file:///Users/mac/Documents/Antigravity/SpaceChallenge/01_datasets)

### Las 3 imágenes sugeridas para tener listas:
1. `temperatura_global.png` (Mapa azul y rojo del SVS #5603).
2. `corrientes_oceanicas.jpg` (Mapa del "Perpetual Ocean" de NASA SVS #3827).
3. `vegetacion_ndvi.png` (Mapa satelital de vegetación global Terra/MODIS SVS #30376).
