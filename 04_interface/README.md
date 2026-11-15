# 📁 Módulo 04: Interfaz de Usuario y Experiencia Jukebox (`04_interface`)

## 🎯 Propósito del Módulo
La interfaz es el corazón de la experiencia: debe ser visualmente impactante, con estética espacial oscura (modo "Centro de Control NASA"), cero fricción y con respuesta inmediata para que los jóvenes sientan el poder de ser "DJs del Clima Planetario".

---

## 🖥️ Arquitectura Visual y Layout Conceptual

```text
+---------------------------------------------------------------------------------------------------------+
|  🌍 NASA GeoBeats: Earth Jukebox      [ 👾 Cosmic Chiptune | 🌌 Deep Atmosphere | ⚡ Solar Synthwave ]  |
+---------------------------------------------------------------------------------------------------------+
|  [Selector: Vegetación NDVI v]  [ 📁 Subir Mi Propio Mapa ]  [ Velocidad: ●────── 120 BPM ]             |
+---------------------------------------------------------------------------------------------------------+
|                                                                                 |
|     +---------------------------------------------------------------------+     |
|     |                                                                     |     |
|     |            MAPA ACTIVO (NASA O SUBIDO POR EL USUARIO)               |     |
|     |                             |                                       |     |
|     |                             | <- LÍNEA DE ESCÁNER LÁSER             |     |
|     |                             |    (Barre de Izquierda a Derecha)     |     |
|     |                             |                                       |     |
|     |              [ 🔴 Cursor DJ táctil sobre cualquier zona ]           |     |
|     |                                                                     |     |
|     +---------------------------------------------------------------------+     |
|                                                                                 |
|     [ ▶ PLAY ESCÁNER ]  [ ⏸ PAUSA ]  [ 🔄 REINICIAR ]     [ 🔊 Volumen General ] |
+---------------------------------------------------------------------------------+
|  📊 Telemetría en Vivo: Píxel X: 450 | Y: 210 | RGB: [34, 180, 72] | Nota: Sol4 |
+---------------------------------------------------------------------------------+
```

---

## 🕹️ Modos de Interacción para el Usuario

### 1. Modo Escáner Satelital (Playback Automático)
- Una línea vertical de luz (estilo haz láser de satélite orbital) barre el mapa de izquierda a derecha.
- Al cruzar cada columna de píxeles, dispara en tiempo real las notas correspondientes a las anomalías de esa longitud geográfica.
- Permite ajustar la velocidad de rotación (BPM) para hacer la canción más rápida o más lenta.

### 2. Modo DJ Táctil / Explorador (Manual por Cursor)
- El usuario mueve libremente el puntero del mouse sobre el planeta.
- Cada punto del mapa actúa como una "tecla" o "pad de sintetizador": hacer hover o click reproduce la firma sonora exacta de esa región (ej. Antártida = bajo glacial; Sahara = tono agudo ardiente).
- Ofrece feedback visual inmediato: una onda expansiva o halo de luz en las coordenadas pulsadas.

### 3. Panel de Telemetría Científica
- Para reforzar la seriedad del desafío científico ante el jurado, una pequeña barra inferior muestra en tiempo real:
  - Región geográfica o coordenadas del píxel.
  - Valores RGB leídos en el punto.
  - La nota musical generada en la escala.

### 4. 📁 Carga de Imagen Propia (Custom Map Upload) — *Efecto Inmersivo*
- **¿Cómo funciona?** El usuario hace clic en *"Subir Mi Propio Mapa"* o arrastra (`drag-and-drop`) un archivo `.png` o `.jpg`.
- **Procesamiento instantáneo en cliente:** La imagen se dibuja inmediatamente sobre el Canvas local y la Jukebox ajusta automáticamente su ancho y alto.
- **¿Qué permite probar?**
  - Subir otros mapas satelitales descargados por el usuario desde *NASA Worldview* o *earth.gov*.
  - Subir fotos de su propia ciudad, un dibujo o un mapa local para ver "a qué suena su barrio".
  - **Cero backend / Cero espera:** Al procesarse en el navegador con el FileReader nativo de JavaScript, la sonificación comienza en menos de 1 segundo sin subir archivos a un servidor.
