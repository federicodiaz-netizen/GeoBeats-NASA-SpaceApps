# 📁 Módulo 02: Motor de Sonificación y Lógica de Mapeo (`02_sonification`)

## 🎯 Propósito del Módulo
Este módulo define **el puente matemático y musical** que convierte datos visuales (píxeles, canales RGB, coordenadas X/Y) en frecuencias sonoras, duraciones y dinámicas musicales. Aquí se transforman píxeles silenciosos en melodías audibles.

---

## 🎼 1. La Regla de Oro: Armonía Garantizada (Escala Pentatónica)
Si se mapeara cada tono directamente a frecuencias aleatorias (ej. 247 Hz, 311 Hz, etc.), el resultado sonaría caótico y ruidoso. 

Para que la experiencia sea agradable e inmersiva para los jóvenes, **restringimos el universo de notas a escalas pentatónicas**:
- **Escala Pentatónica Menor (A, C, D, E, G):** Crea una atmósfera cinematográfica, misteriosa y espacial.
- **Escala Pentatónica Mayor (C, D, E, G, A):** Genera una sensación brillante, positiva y de descubrimiento.
- *Propiedad clave:* En una escala pentatónica, **ninguna nota genera disonancias desagradables con otra**, garantizando que cualquier combinación resultante suene musical.

---

## 🗺️ 2. Matriz de Traducción (Visual -> Parámetro Musical)

| Parámetro Visual de la Imagen | Parámetro Musical Resultante | Justificación Conceptual |
| :--- | :--- | :--- |
| **Canal Rojo (R) o Brillo** | **Tono (Pitch / Frecuencia)** | Colores cálidos y calientes se asocian instintivamente con frecuencias más altas o agudas. |
| **Canal Azul (B)** | **Graves / Tonalidad Sub-Baja** | Zonas oceánicas y frías proporcionan la base de bajos profundos. |
| **Posición Vertical (Eje Y)** | **Octava / Registro** | El Norte del planeta suena en registros altos; la zona ecuatorial en medios; el Polo Sur en registros graves. |
| **Intensidad / Saturación** | **Volumen (Velocity / Gain)** | Zonas de cambio climático crítico (anomalías severas) suenan más fuerte e imponentes. |
| **Densidad de Píxeles Activos** | **Tempo / Repetición (BPM)** | Mayor concentración de fenómeno (ej. nubes densas de CO₂) produce pulsos rítmicos más rápidos. |

---

## 🧹 3. Filtros de Exclusión y Máscaras Negras
Para evitar ruido innecesario:
- **Espacio Exterior (Fondo Negro #000000):** Se silencia completamente (silencio musical).
- **Océano Calmo (Azul Base Estable):** Se mantiene como una nota pedal de fondo o "drone" ambiental suave, permitiendo que solo las anomalías climáticas destaquen en primer plano melódico.
