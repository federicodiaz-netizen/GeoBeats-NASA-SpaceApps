/**
 * NASA GeoBeats - Descripciones de Imágenes y Guía de Voz para Accesibilidad (descriptions.js)
 * Contiene las instrucciones habladas para personas no videntes y la introducción de 1 párrafo
 * para cada mapa satelital (en Español e Inglés).
 */

window.GEOBEATS_ACCESSIBILITY = {
  // Instrucciones generales habladas al abrir la página
  welcomeInstructions: {
    es: "Bienvenido a NASA GeoBeats, plataforma auditiva de la Tierra para personas no videntes. Para hacer sonar el mapa, toca o desliza tu dedo o cursor sobre el centro de la pantalla: las zonas oscuras suenan con notas graves y las zonas brillantes con notas agudas. Puedes presionar la barra espaciadora para iniciar o detener el escáner automático, o presionar cualquier tecla de letra para detener o reiniciar esta narración desde el principio.",
    en: "Welcome to NASA GeoBeats, an auditory Earth platform designed for blind and visually impaired users. To make the map sound, touch or slide your finger or cursor across the center of the screen: dark areas play low notes and bright areas play high notes. You can press the spacebar to start or stop the automatic scanner, or press any letter key to stop or restart this narration from the beginning."
  },

  // Descripciones de 1 párrafo por cada imagen satelital (mostradas en pantalla y leídas por voz)
  datasets: {
    "/01_datasets/vegetacion_ndvi.png": {
      es: {
        title: "🌿 Mapa Global: Vegetación y Biomasa (NDVI)",
        paragraph: "Este mapa satelital de la NASA muestra el índice global de vegetación sobre los continentes. Los océanos aparecen oscuros y profundos produciendo tonos graves, mientras que las grandes selvas como la Amazonía, África central y los bosques boreales brillan en tonos verdes intensos que generan melodías cálidas y agudas al tocarlos."
      },
      en: {
        title: "🌿 Global Map: Vegetation & Biomass (NDVI)",
        paragraph: "This NASA satellite map displays the global vegetation index across the continents. Oceans appear dark and deep, producing low bass tones, while dense rainforests such as the Amazon, Central Africa, and boreal forests glow in vibrant greens that generate warm, higher-pitched melodies when touched."
      }
    },
    "/01_datasets/temperatura_global.png": {
      es: {
        title: "🌡️ Mapa Global: Anomalías Térmicas",
        paragraph: "Esta imagen registra las anomalías de temperatura en la superficie terrestre y marina. Las regiones frías y polares en tonos azules y oscuros emiten frecuencias graves y suaves, mientras que las zonas con olas de calor extremo en tonos rojos, naranjas y amarillos brillantes elevan la altura de las notas con un timbre intenso de alerta térmica."
      },
      en: {
        title: "🌡️ Global Map: Thermal Anomalies",
        paragraph: "This image records surface temperature anomalies across land and sea. Cold and polar regions in dark blue tones emit deep, gentle frequencies, while areas experiencing extreme heatwaves in bright red, orange, and yellow tones raise the musical pitch with an intense thermal alert timbre."
      }
    },
    "/01_datasets/corrientes_oceanicas.jpg": {
      es: {
        title: "🌊 Mapa Global: Corrientes Oceánicas (ECCO)",
        paragraph: "Esta visualización del modelo oceánico de la NASA retrata el movimiento y la velocidad de las corrientes marinas alrededor del planeta. Las aguas calmas y abisales suenan con notas graves y profundas, mientras que las corrientes rápidas y turbulentas como la Corriente del Golfo brillan con trazos luminosos que disparan notas agudas y fluidas."
      },
      en: {
        title: "🌊 Global Map: Ocean Currents (ECCO)",
        paragraph: "This NASA ocean model visualization portrays the movement and speed of marine currents around the planet. Calm, abyssal waters sound as deep bass notes, while fast-flowing currents such as the Gulf Stream glow with bright swirling trails that trigger high, flowing musical notes."
      }
    },
    "/01_datasets/sudamerica_incendios_ndvi.jpg": {
      es: {
        title: "🌎 Sudamérica: Amazonía e Incendios Forestales",
        paragraph: "Esta imagen satelital enfoca Sudamérica combinando la cobertura vegetal de la selva amazónica con focos activos de incendios. Al recorrer el mapa sentirás la transición desde los tonos graves del océano Atlántico y Pacífico hacia la calidez media de la vegetación verde, interrumpida por puntos brillantes de fuego que suenan con notas agudas vibrantes."
      },
      en: {
        title: "🌎 South America: Amazonia & Wildfires",
        paragraph: "This satellite image focuses on South America, combining Amazon rainforest vegetation cover with active wildfire hotspots. As you explore the map, you will hear the transition from deep ocean bass tones to the warm mid-range of green vegetation, punctuated by bright fire hotspots that ring out as vibrant high notes."
      }
    },
    "/01_datasets/patagonia_glaciar_upsala.jpg": {
      es: {
        title: "🏔️ Argentina: Glaciar Upsala en la Patagonia",
        paragraph: "Esta fotografía satelital captura el retroceso del Glaciar Upsala en los Andes patagónicos argentinos. Las extensas lenguas de hielo blanco y nieve reflejan gran luminosidad produciendo notas cristalinas y agudas en la parte superior de la escala, contrastando con las aguas oscuras del lago glacial y las montañas rocosas que resuenan en el registro grave."
      },
      en: {
        title: "🏔️ Argentina: Upsala Glacier in Patagonia",
        paragraph: "This satellite photograph captures the Upsala Glacier in the Patagonian Andes of Argentina. The vast tongues of white ice and snow reflect high brightness, producing crystalline high-pitched notes at the top of the scale, contrasting with the dark glacial lake waters and rocky mountains resonating in the lower register."
      }
    },
    "custom": {
      es: {
        title: "📁 Mapa Personalizado del Usuario",
        paragraph: "Has cargado una imagen personalizada en el visor satelital. Toca o desliza sobre la pantalla para explorar su relieve sonoro: las regiones más oscuras reproducirán notas graves de la escala seleccionada y las zonas más claras o coloridas activarán notas agudas."
      },
      en: {
        title: "📁 Custom User Map",
        paragraph: "You have loaded a custom image into the satellite viewer. Touch or slide across the screen to explore its sonic relief: darker regions will play low notes from the selected scale while brighter or colorful areas will trigger high notes."
      }
    }
  }
};
