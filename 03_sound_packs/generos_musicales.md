# 🎷 Exploración de Géneros Musicales en GeoBeats (Sound Personalities)
### Cómo adaptar la ciencia satelital de la NASA a estilos musicales reales sin perder el rigor de los datos.

---

## 🎯 El Desafío Conceptual: "La Tierra como Instrumentista"
El reto de la NASA **no es poner música de fondo pregrabada**, sino que **el mapa mismo componga y toque las notas**. 

Para que un género musical (Jazz, Blues, Rock, Melódico/Cinematográfico) sea reconocible manteniendo la fidelidad de los datos satelitales, se ajustan **3 capas de reglas**:
1. **La Escala Musical (Armonía):** Las notas permitidas según el género.
2. **El Ritmo & Articulación (Groove):** Cómo se atacan y sostienen las notas (swing, distorsión, sustain).
3. **El Timbre / Instrumentación:** Qué instrumentos virtuales interpretan los datos (saxo/piano, guitarra eléctrica, cuerdas orquestales).

---

## 🎼 1. Los 5 Géneros Adaptados al Planeta

### 🎷 A. "Earth Jazz & Bossa" (Improvisación Armónica & Sofisticación)
*¿Cómo suena la Tierra en Jazz?*
- **Escala Musical:** Escala Dórica o Lidia con notas de paso (Séptimas mayores y Novenas: $Do, Re, Mi\flat, Fa, Sol, La, Si\flat, Re$).
- **Traducción de Datos NASA:**
  - **Océanos (Azul):** Acordes de fondo suaves con piano eléctrico Rhodes ($Maj7$, $m9$) que flotan suavemente.
  - **Vegetación (Verde):** Arpegios ágiles con sonido de vientos (saxo soprano o clarinete sintetizado).
  - **Línea de Escáner:** Utiliza un ritmo con **"Swing"** (las notas no caen cuadradas en el tiempo, sino con cadencia sincopada y relajada).
- **Sensación:** Sofisticada, orgánica, nocturna y relajada.

---

### 🎸 B. "Orbital Rock & Distortion" (Energía, Tensión & Riffs)
*¿Cómo suena la Tierra en Rock?*
- **Escala Musical:** Escala de Blues / Pentatónica Menor con 5ª bemol ("Blue Note" o nota de tensión).
- **Traducción de Datos NASA:**
  - **Olas de Calor & Incendios (Rojo intenso):** Se activa un **overdrive/distorsión analógica** y un vibrato agresivo tipo guitarra eléctrica solista (*lead guitar bend*).
  - **Línea de Escáner:** Un pulso rítmico potente y marcado en corcheas constantes (un "Power Chord" en la base que cambia cuando el satélite cruza un continente).
  - **Continentes rocosos/áridos:** Tonalidades secas con ataque cortante (*palm mute*).
- **Sensación:** Enérgica, dramática, potente y de llamado urgente a la acción.

---

### 🎺 C. "Climate Blues" (Melancolía, Raíz & Desahogo)
*¿Cómo suena la Tierra en Blues?*
- **Escala Musical:** La clásica escala de Blues de 6 notas ($La, Do, Re, Re\sharp, Mi, Sol$).
- **Traducción de Datos NASA:**
  - **Deshielo Glaciar & Sequías:** La "Blue Note" ($Re\sharp / Mi\flat$) se dispara específicamente cuando hay una **anomalía climática negativa** (pérdida de hielo o estrés hídrico), transmitiendo una sensación inmediata de lamento y fragilidad.
  - **Timbre:** Órgano Hammond con trémolo suave (*Leslie speaker*) y guitarra limpia estilo bluesman de Chicago.
  - **Articulación:** Notas con caída de tono (*pitch bend down*) al final de cada compás.
- **Sensación:** Emotiva, humana, nostálgica y reflexiva.

---

### 🎻 D. "Cinematic Melodic / Neo-Classical" (Banda Sonora & Cuerdas)
*¿Cómo suena la Tierra como película épica (Hans Zimmer / Ludovico Einaudi)?*
- **Escala Musical:** Modo Eólico natural enriquecido (Acordes suspendidos $sus2$ y $sus4$).
- **Traducción de Datos NASA:**
  - **Corrientes Oceánicas:** Cuerdas frotadas (violines y violonchelos con legato continuo y mucho *sustain*). No hay notas cortas; la música "fluye" como agua.
  - **Polos y Altas Latitudes:** Arpas o pianos de cola con notas agudas resonantes y reverb de sala de conciertos.
  - **Línea de Escáner:** Notas lentas y expresivas que van creciendo en volumen conforme la biomasa o el océano es más profundo.
- **Sensación:** Grandiosa, emotiva, majestuosa y de respeto por la naturaleza.

---

### 🌴 E. "Tropical Ambient / Marimba Biome" (Ritmos de la Naturaleza)
*¿Cómo suena la vegetación viva de la Amazonía o el Congo?*
- **Escala Musical:** Escala Mayor Pentatónica africana/caribeña ($Do, Re, Mi, Sol, La$).
- **Traducción de Datos NASA:**
  - **Selvas densas:** Timbres de percusión tonal de madera (Marimba, Kalimba o Xilófono orgánico).
  - **Variación de vegetación (NDVI):** A mayor densidad de clorofila, más rápido es el arpegio rítmico, como gotas de lluvia rebotando en las hojas.
- **Sensación:** Cálida, viva, lúdica y conectada con la biodiversidad.

---

## 🛠️ Cómo se Implementa Técnicamente en Web Audio API (Sin romper nada)

No hace falta cambiar el diseño de la interfaz; solo se traduce en el objeto de configuración de audio:

```javascript
// Esquema conceptual de un Género en el Motor de Audio
const GENRE_PRESETS = {
  jazz: {
    name: "Earth Jazz",
    scale: [130.8, 146.8, 155.6, 174.6, 196.0, 220.0, 233.1], // Dórico con 7ma
    waveType: "triangle", // Timbre cálido tipo Rhodes
    swing: 0.35,          // Retraso rítmico humano
    filterFreq: 1800
  },
  rock: {
    name: "Orbital Rock",
    scale: [110.0, 130.8, 146.8, 155.6, 164.8, 196.0], // Blues Scale con Blue Note
    waveType: "sawtooth", // Onda rica y filosa
    distortion: 0.6,      // Saturación de guitarra
    attack: 0.01
  },
  cinematic: {
    name: "Cinematic Earth",
    scale: [110.0, 146.8, 164.8, 196.0, 220.0, 261.6],
    waveType: "sine",
    reverbLength: 3.5,    // Eco espacial profundo
    sustain: 1.2
  }
};
```

---

## 🏆 El Valor para el Jurado del Hackathon
Presentar géneros musicales con identidad propia demuestra que la herramienta:
1. **Es versátil:** Puede crear desde la banda sonora de un documental serio de National Geographic hasta un track interactivo para un videojuego educativo o una sesión de meditación.
2. **Conecta con diferentes públicos:** Los jóvenes pueden elegir el estilo con el que más se identifican para "escuchar su planeta".
