# 📁 Módulo 01: Adquisición y Catálogo de Datasets NASA (`01_datasets`)

## 🎯 Propósito del Módulo
Este módulo almacena y cataloga la **materia prima visual** proveniente del Earth Information Center (EIC) de la NASA. En lugar de buscar imágenes en internet a último momento, este directorio provee un set curado de observaciones satelitales de alto contraste que representen fenómenos climáticos reales.

---

## 🛰️ Datasets Conceptuales Seleccionados

1. **`temperatura_global.png` (Mapa de Anomalías Térmicas):**
   - **Fuente:** Satélites MODIS / Terra & Aqua (NASA).
   - **Características Visuales:** Gradiente cromático intenso: azul oscuro (zonas frías/glaciares) hasta rojo carmesí y blanco (olas de calor extremas).
   - **Objetivo Sonoro:** Mostrar el calentamiento planetario mediante cambios de tono o tensión armónica.

2. **`corrientes_oceanicas.png` (Dinámica de Circulación Marina):**
   - **Fuente:** Modelo ECCO (Estimating the Circulation and Climate of the Ocean).
   - **Características Visuales:** Patrones fluidos vectoriales, torbellinos en tonos cian, azul profundo y verde esmeralda.
   - **Objetivo Sonoro:** Generar ritmos oscilatorios y melodías fluidas continuas que simulen olas y mareas.

3. **`vegetacion_ndvi.png` (Índice de Vegetación y Salud de la Biósfera - NDVI):**
   - **Fuente:** Satélite Terra / Instrumento MODIS (NASA SVS #30376).
   - **Características Visuales:** Mapa global satelital de alta resolución (4104x2304) que muestra la densidad vegetal del planeta: tonos marrón/arena para desiertos áridos hasta verde esmeralda profundo y denso en la Amazonía, selvas tropicales y bosques boreales.
   - **Objetivo Sonoro:** Mapear la "vida y el pulmón verde" del planeta: notas orgánicas, acordes ricos en zonas con biomasa densa y notas secas/silencios en zonas desérticas o deforestadas.

---

## 📋 Reglas de Preparación y Buenas Prácticas (Conceptual)
- **Resolución Adecuada:** Las imágenes deben ser redimensionadas previamente a una cuadrícula ligera (por ejemplo 100x100 o 64x64 píxeles). Una resolución 4K provocaría un retraso de procesamiento y saturación sonora.
- **Relación de Aspecto Proyectada:** Mapas en proyección equirectangular (cilíndrica) estándar, para que el barrido horizontal coincida geográficamente con la rotación de la Tierra de oeste a este.
- **Metadatos Descriptivos:** Cada imagen debe acompañarse de su rango físico (ej. "Rango térmico: -4°C a +4°C") para que el módulo de traducción entienda los valores mínimos y máximos.
