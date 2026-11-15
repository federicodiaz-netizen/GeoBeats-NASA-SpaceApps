/**
 * NASA GeoBeats - Controlador Principal de la Interfaz (app.js)
 * Maneja el Canvas, escaneo láser automático, interacción DJ táctil,
 * selección de escala musical (Mayor/Menor) y cambio de idioma (Español / Inglés).
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('mapCanvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const canvasWrapper = document.getElementById('canvasWrapper');
  const scanLine = document.getElementById('scanLine');
  const crosshairX = document.getElementById('crosshairX');
  const crosshairY = document.getElementById('crosshairY');
  const cursorPulse = document.getElementById('cursorPulse');
  const modeBadge = document.getElementById('modeBadge');

  // Selectores de Control
  const datasetSelect = document.getElementById('datasetSelect');
  const customImageInput = document.getElementById('customImageInput');
  const scaleRootSelect = document.getElementById('scaleRootSelect');
  const scaleModeSelect = document.getElementById('scaleModeSelect');
  const btnPlay = document.getElementById('btnPlay');
  const btnStop = document.getElementById('btnStop');
  const speedRange = document.getElementById('speedRange');
  const speedValue = document.getElementById('speedValue');
  const volumeRange = document.getElementById('volumeRange');
  const volumeValue = document.getElementById('volumeValue');
  const bgVolumeRange = document.getElementById('bgVolumeRange');
  const bgVolumeValue = document.getElementById('bgVolumeValue');
  const btnBgMusic = document.getElementById('btnBgMusic');
  const btnVoiceGuide = document.getElementById('btnVoiceGuide');
  const packButtons = document.querySelectorAll('.pack-btn');
  const langButtons = document.querySelectorAll('.lang-option');

  // Etiquetas UI Traducibles y de Accesibilidad
  const missionTagText = document.getElementById('missionTagText');
  const nasaHudBadge = document.getElementById('nasaHudBadge');
  const appSubtitle = document.getElementById('appSubtitle');
  const datasetLabel = document.getElementById('datasetLabel');
  const uploadLabel = document.getElementById('uploadLabel');
  const scaleLabel = document.getElementById('scaleLabel');
  const volumeLabelText = document.getElementById('volumeLabelText');
  const bgVolumeLabelText = document.getElementById('bgVolumeLabelText');
  const introBadgeLabel = document.getElementById('introBadgeLabel');
  const imageIntroTitle = document.getElementById('imageIntroTitle');
  const imageIntroText = document.getElementById('imageIntroText');
  const titleCoords = document.getElementById('titleCoords');
  const titlePixelColor = document.getElementById('titlePixelColor');
  const telemScaleTitle = document.getElementById('telemScaleTitle');
  const titleFreq = document.getElementById('titleFreq');
  const titleAccess = document.getElementById('titleAccess');

  // Telemetría UI
  const telemCoords = document.getElementById('telemCoords');
  const telemRGB = document.getElementById('telemRGB');
  const colorSwatch = document.getElementById('colorSwatch');
  const telemNote = document.getElementById('telemNote');
  const telemFreq = document.getElementById('telemFreq');
  const telemDesc = document.getElementById('telemDesc');

  // Diccionario de Traducción (ES / EN)
  const I18N = {
    es: {
      pageTitle: 'NASA GeoBeats - Jukebox Terrestre',
      missionTag: 'NASA EARTH INFORMATION CENTER • TELEMETRÍA EN VIVO',
      hudBadge: '🛰️ NASA EOSDIS • SISTEMA DE OBSERVACIÓN TERRESTRE',
      subtitle: 'Earth Information Jukebox • Sonificación Satelital en Tiempo Real',
      datasetLabel: '📡 Dataset Satelital:',
      uploadLabel: '📁 Subir Mi Propio Mapa',
      scaleLabel: '🎼 Escala:',
      btnPlay: '▶ INICIAR ESCÁNER',
      btnStop: '⏹ DETENER',
      volumeLabel: '🔊 Vol. Interactivo:',
      bgVolumeLabel: '🎵 Vol. Fondo:',
      bgMusicOn: '🎵 Fondo Armónico: ON',
      bgMusicOff: '🔇 Fondo Armónico: OFF',
      voiceGuideOn: '🗣️ Guía de Voz: ON',
      voiceGuideOff: '🔇 Guía de Voz: OFF',
      introBadge: '♿ GUÍA AUDITIVA & DESCRIPCIÓN DE IMAGEN',
      modeTouch: 'MODO: DJ TÁCTIL (Haz clic o mueve el cursor)',
      modeScanner: 'MODO: ESCÁNER SATELITAL EN VIVO (Reproducción Automática)',
      titleCoords: 'COORDENADAS',
      titlePixelColor: 'COLOR DEL PÍXEL',
      titleNotePrefix: 'NOTA MUSICAL',
      titleFreq: 'FRECUENCIA DE AUDIO',
      titleAccess: 'ACCESIBILIDAD MULTISENSORIAL',
      initialDesc: 'Pasa el cursor o activa el escáner para escuchar cómo suena la superficie de la Tierra.',
      silence: 'Silencio',
      brightness: 'Luminosidad',
      pitch: 'Tono',
      datasetLoaded: (w, h) => `Dataset cargado con éxito: ${w}x${h} px. ¡Listo para interactuar!`,
      datasetError: 'Aviso: Usa "Subir Mi Propio Mapa" o selecciona otro mapa de la lista.',
      customLoaded: (name) => `¡Imagen personalizada cargada con éxito! [${name}]`,
      fallbackCanvas: '🌍 Mapa Generativo Satelital (NASA Ready)',
      scaleUpdated: (label, notes) => `🎼 Escala activa: ${label} [${notes}] • Banda sonora y mapa sincronizados.`,
      packDescriptions: (scaleLbl) => ({
        chiptune: `👾 Sound Pack: Cosmic Chiptune activo en ${scaleLbl} (Onda cuadrada retro 8-bit).`,
        lofi: `🌌 Sound Pack: Deep Atmosphere activo en ${scaleLbl} (Pad espacial y campanas Lo-Fi).`,
        synthwave: `⚡ Sound Pack: Solar Synthwave activo en ${scaleLbl} (Bajos analógicos y arpegiador Cyberpunk).`,
        jazz: `🎷 Sound Pack: Earth Jazz activo en ${scaleLbl} (Acordes de 7ma y timbre Rhodes cálido).`,
        rock: `🎸 Sound Pack: Orbital Rock activo en ${scaleLbl} (Overdrive y distorsión armónica).`,
        cinematic: `🎻 Sound Pack: Cinematic Melodic activo en ${scaleLbl} (Cuerdas orquestales y atmósfera neo-clásica).`
      })
    },
    en: {
      pageTitle: 'NASA GeoBeats - Earth Information Jukebox',
      missionTag: 'NASA EARTH INFORMATION CENTER • MISSION TELEMETRY',
      hudBadge: '🛰️ NASA EOSDIS • EARTH OBSERVING SYSTEM',
      subtitle: 'Earth Information Jukebox • Real-Time Satellite Sonification',
      datasetLabel: '📡 Satellite Dataset:',
      uploadLabel: '📁 Upload Custom Map',
      scaleLabel: '🎼 Scale:',
      btnPlay: '▶ START SCANNER',
      btnStop: '⏹ STOP',
      volumeLabel: '🔊 Interactive Vol:',
      bgVolumeLabel: '🎵 Backing Vol:',
      bgMusicOn: '🎵 Harmonic Backing: ON',
      bgMusicOff: '🔇 Harmonic Backing: OFF',
      voiceGuideOn: '🗣️ Voice Guide: ON',
      voiceGuideOff: '🔇 Voice Guide: OFF',
      introBadge: '♿ AUDIO GUIDE & IMAGE DESCRIPTION',
      modeTouch: 'MODE: TOUCH DJ (Click or move cursor)',
      modeScanner: 'MODE: LIVE SATELLITE SCANNER (Auto-Play)',
      titleCoords: 'COORDINATES',
      titlePixelColor: 'PIXEL COLOR',
      titleNotePrefix: 'MUSICAL NOTE',
      titleFreq: 'AUDIO FREQUENCY',
      titleAccess: 'MULTISENSORIAL ACCESSIBILITY',
      initialDesc: 'Hover the cursor or start the scanner to hear how Earth’s surface sounds.',
      silence: 'Silence',
      brightness: 'Brightness',
      pitch: 'Pitch',
      datasetLoaded: (w, h) => `Dataset successfully loaded: ${w}x${h} px. Ready to interact!`,
      datasetError: 'Notice: Use "Upload Custom Map" or select another dataset from the list.',
      customLoaded: (name) => `Custom image successfully loaded! [${name}]`,
      fallbackCanvas: '🌍 Generative Satellite Map (NASA Ready)',
      scaleUpdated: (label, notes) => `🎼 Active scale: ${label} [${notes}] • Soundtrack and map synchronized.`,
      packDescriptions: (scaleLbl) => ({
        chiptune: `👾 Sound Pack: Cosmic Chiptune active in ${scaleLbl} (8-bit retro square wave).`,
        lofi: `🌌 Sound Pack: Deep Atmosphere active in ${scaleLbl} (Space pad & Lo-Fi bells).`,
        synthwave: `⚡ Sound Pack: Solar Synthwave active in ${scaleLbl} (Analog bass & Cyberpunk synth).`,
        jazz: `🎷 Sound Pack: Earth Jazz active in ${scaleLbl} (7th chords & warm Rhodes timbre).`,
        rock: `🎸 Sound Pack: Orbital Rock active in ${scaleLbl} (Harmonic overdrive & distortion).`,
        cinematic: `🎻 Sound Pack: Cinematic Melodic active in ${scaleLbl} (Orchestral strings & neo-classical score).`
      })
    }
  };

  // Estado del Sistema
  let currentLang = 'es';
  let currentDatasetKey = datasetSelect ? datasetSelect.value : '/01_datasets/vegetacion_ndvi.png';
  let voiceGuideEnabled = true;
  let hasSpokenInitialWelcome = false;
  let currentImage = new Image();
  let isScanning = false;
  let scanX = 0;
  let scanAnimationId = null;
  let bpm = 60;
  let lastSoundTime = 0;

  // ==========================================
  // 0a. Guía de Voz para No Videntes y Descripción de Imagen (descriptions.js)
  // ==========================================
  function getDatasetDescriptionObj(datasetKey, lang) {
    const db = window.GEOBEATS_ACCESSIBILITY && window.GEOBEATS_ACCESSIBILITY.datasets;
    if (!db) return null;
    const entry = db[datasetKey] || db.custom;
    return entry ? (entry[lang] || entry.es) : null;
  }

  function speakAccessibilityText(text, onStartedCallback) {
    if (!voiceGuideEnabled || !('speechSynthesis' in window) || !text) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = currentLang === 'en' ? 'en-US' : 'es-ES';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Seleccionar una voz natural del idioma activo si está disponible
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const langPrefix = currentLang === 'en' ? 'en' : 'es';
        const preferredVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }

      if (onStartedCallback) {
        utterance.onstart = onStartedCallback;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Error en síntesis de voz:', e);
    }
  }

  function updateImageIntro(datasetKey = currentDatasetKey, speakMode = 'image') {
    currentDatasetKey = datasetKey;
    const descObj = getDatasetDescriptionObj(datasetKey, currentLang);
    if (!descObj) return;

    if (imageIntroTitle) imageIntroTitle.textContent = descObj.title;
    if (imageIntroText) imageIntroText.textContent = descObj.paragraph;

    if (!voiceGuideEnabled) return;

    const welcomeText = (window.GEOBEATS_ACCESSIBILITY && window.GEOBEATS_ACCESSIBILITY.welcomeInstructions)
      ? window.GEOBEATS_ACCESSIBILITY.welcomeInstructions[currentLang]
      : '';

    if (speakMode === 'welcome') {
      const fullSpeech = `${welcomeText} ${descObj.title}. ${descObj.paragraph}`;
      speakAccessibilityText(fullSpeech, () => {
        hasSpokenInitialWelcome = true;
      });
    } else if (speakMode === 'image') {
      const imageSpeech = `${descObj.title}. ${descObj.paragraph}`;
      speakAccessibilityText(imageSpeech);
    }
  }

  // ==========================================
  // 0b. Cambio de Idioma (Español 🇪🇸 / Inglés 🇺🇸)
  // ==========================================
  function applyLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'es';
    document.documentElement.lang = currentLang;
    const t = I18N[currentLang];

    document.title = t.pageTitle;
    const scaleLbl = window.geoAudio.setLanguage(currentLang);

    if (missionTagText) missionTagText.textContent = t.missionTag;
    if (nasaHudBadge) nasaHudBadge.textContent = t.hudBadge;
    if (appSubtitle) appSubtitle.textContent = t.subtitle;
    if (datasetLabel) datasetLabel.textContent = t.datasetLabel;
    if (uploadLabel) uploadLabel.textContent = t.uploadLabel;
    if (scaleLabel) scaleLabel.textContent = t.scaleLabel;
    if (btnPlay) btnPlay.textContent = t.btnPlay;
    if (btnStop) btnStop.textContent = t.btnStop;
    if (volumeLabelText) volumeLabelText.textContent = t.volumeLabel;
    if (bgVolumeLabelText) bgVolumeLabelText.textContent = t.bgVolumeLabel;
    if (introBadgeLabel) introBadgeLabel.textContent = t.introBadge;

    if (btnBgMusic) {
      btnBgMusic.textContent = window.geoAudio.bgEnabled ? t.bgMusicOn : t.bgMusicOff;
    }

    if (btnVoiceGuide) {
      btnVoiceGuide.textContent = voiceGuideEnabled ? t.voiceGuideOn : t.voiceGuideOff;
    }

    if (modeBadge) {
      modeBadge.textContent = isScanning ? t.modeScanner : t.modeTouch;
    }

    if (titleCoords) titleCoords.textContent = t.titleCoords;
    if (titlePixelColor) titlePixelColor.textContent = t.titlePixelColor;
    if (telemScaleTitle) telemScaleTitle.textContent = `${t.titleNotePrefix} (${scaleLbl.toUpperCase()})`;
    if (titleFreq) titleFreq.textContent = t.titleFreq;
    if (titleAccess) titleAccess.textContent = t.titleAccess;

    // Traducir opciones de Dataset
    if (datasetSelect) {
      Array.from(datasetSelect.options).forEach(opt => {
        const text = opt.getAttribute(`data-${currentLang}`);
        if (text) opt.textContent = text;
      });
    }

    // Traducir opciones de Modo Mayor / Menor
    if (scaleModeSelect) {
      Array.from(scaleModeSelect.options).forEach(opt => {
        const text = opt.getAttribute(`data-${currentLang}`);
        if (text) opt.textContent = text;
      });
    }

    if (telemNote && (telemNote.textContent === 'Silencio' || telemNote.textContent === 'Silence')) {
      telemNote.textContent = t.silence;
    }

    const scaleNotes = window.geoAudio.activeScale
      .slice(0, 7)
      .map(n => currentLang === 'en' ? `${n.key} (${n.solfege})` : `${n.solfege} (${n.key})`)
      .join(' - ');
    if (telemDesc) {
      telemDesc.textContent = t.scaleUpdated(scaleLbl, scaleNotes);
    }

    // Actualizar el párrafo escrito y leer bienvenida + descripción en el nuevo idioma si la guía de voz está activa
    updateImageIntro(currentDatasetKey, 'welcome');
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      langButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedLang = btn.getAttribute('data-lang');
      applyLanguage(selectedLang);
    });
  });

  // Cargar imagen inicial e iniciar instrucciones habladas de bienvenida
  loadImage(datasetSelect.value);
  updateImageIntro(datasetSelect.value, 'welcome');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (voiceGuideEnabled && !hasSpokenInitialWelcome && !window.speechSynthesis.speaking) {
        updateImageIntro(currentDatasetKey, 'welcome');
      }
    };
  }

  function loadImage(src) {
    currentImage = new Image();
    currentImage.onload = () => {
      resizeCanvas();
      drawCurrentMap();
      telemDesc.textContent = I18N[currentLang].datasetLoaded(currentImage.width, currentImage.height);
    };
    currentImage.onerror = (err) => {
      console.warn('Error cargando imagen:', src, err);
      drawGenerativeFallback();
      telemDesc.textContent = I18N[currentLang].datasetError;
    };
    currentImage.src = src;
  }

  function resizeCanvas() {
    const w = canvasWrapper.clientWidth || canvasWrapper.offsetWidth || 1200;
    const h = canvasWrapper.clientHeight || canvasWrapper.offsetHeight || 680;
    canvas.width = w;
    canvas.height = h;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    drawCurrentMap();
  });

  function drawCurrentMap() {
    if (!currentImage.complete || currentImage.width === 0) return;
    if (canvas.width === 0 || canvas.height === 0) {
      resizeCanvas();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  }

  function drawGenerativeFallback() {
    canvas.width = canvasWrapper.clientWidth || 1200;
    canvas.height = canvasWrapper.clientHeight || 680;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#041c32');
    grad.addColorStop(0.5, '#04293a');
    grad.addColorStop(1, '#064663');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00f3ff';
    ctx.font = '20px Orbitron';
    ctx.fillText(I18N[currentLang].fallbackCanvas, 40, 60);
  }

  // ==========================================
  // 1. Selector de Sound Packs
  // ==========================================
  packButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      packButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const pack = btn.getAttribute('data-pack');
      window.geoAudio.setSoundPack(pack);

      const scaleLbl = window.geoAudio.getScaleLabel(currentLang);
      const descriptions = I18N[currentLang].packDescriptions(scaleLbl);
      telemDesc.textContent = descriptions[pack] || '';
      
      // Sonido de confirmación en la nota tónica de la escala activa
      const tonicFreq = (window.geoAudio.activeScale && window.geoAudio.activeScale[7])
        ? window.geoAudio.activeScale[7].freq
        : 261.63;
      window.geoAudio.playTone(tonicFreq, 0.25, 0.7);
    });
  });

  // ==========================================
  // 1b. Selector de Escala Musical (Tónica y Modo Mayor/Menor)
  // ==========================================
  function handleScaleChange() {
    const rootKey = scaleRootSelect ? scaleRootSelect.value : 'C';
    const mode = scaleModeSelect ? scaleModeSelect.value : 'major';
    const label = window.geoAudio.setScale(rootKey, mode);
    const t = I18N[currentLang];

    if (telemScaleTitle) {
      telemScaleTitle.textContent = `${t.titleNotePrefix} (${label.toUpperCase()})`;
    }

    // Mostrar las 7 notas que componen la escala elegida
    const scaleNotes = window.geoAudio.activeScale
      .slice(0, 7)
      .map(n => currentLang === 'en' ? `${n.key} (${n.solfege})` : `${n.solfege} (${n.key})`)
      .join(' - ');
    telemDesc.textContent = t.scaleUpdated(label, scaleNotes);

    // Tocar un breve acorde/tónica de confirmación en la nueva escala
    const tonic = window.geoAudio.activeScale[7] ? window.geoAudio.activeScale[7].freq : 261.63;
    window.geoAudio.playTone(tonic, 0.28, 0.7);
  }

  if (scaleRootSelect) {
    scaleRootSelect.addEventListener('change', handleScaleChange);
  }
  if (scaleModeSelect) {
    scaleModeSelect.addEventListener('change', handleScaleChange);
  }

  // ==========================================
  // 2. Cambio de Dataset y Subida de Imagen Propia
  // ==========================================
  datasetSelect.addEventListener('change', (e) => {
    stopScanner();
    loadImage(e.target.value);
    updateImageIntro(e.target.value, 'image');
  });

  customImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        stopScanner();
        loadImage(event.target.result);
        telemDesc.textContent = I18N[currentLang].customLoaded(file.name);
        updateImageIntro('custom', 'image');
      };
      reader.readAsDataURL(file);
    }
  });

  // ==========================================
  // 3. Controles de Velocidad, Volumen, Fondo Armónico y Guía de Voz
  // ==========================================
  speedRange.addEventListener('input', (e) => {
    bpm = parseInt(e.target.value);
    speedValue.textContent = bpm;
  });

  volumeRange.addEventListener('input', (e) => {
    const vol = parseInt(e.target.value);
    volumeValue.textContent = `${vol}%`;
    window.geoAudio.setVolume(vol / 100);
  });

  if (bgVolumeRange) {
    bgVolumeRange.addEventListener('input', (e) => {
      const bgVol = parseInt(e.target.value);
      if (bgVolumeValue) bgVolumeValue.textContent = `${bgVol}%`;
      window.geoAudio.setBackgroundVolume(bgVol / 100);

      // Si el usuario sube la barra desde 0 o estando apagado, reactivar indicador de fondo
      const t = I18N[currentLang];
      if (bgVol === 0) {
        window.geoAudio.setBackgroundEnabled(false);
        if (btnBgMusic) {
          btnBgMusic.textContent = t.bgMusicOff;
          btnBgMusic.classList.remove('active');
          btnBgMusic.classList.add('off');
        }
      } else if (!window.geoAudio.bgEnabled) {
        window.geoAudio.setBackgroundEnabled(true);
        if (btnBgMusic) {
          btnBgMusic.textContent = t.bgMusicOn;
          btnBgMusic.classList.add('active');
          btnBgMusic.classList.remove('off');
        }
      }
    });
  }

  if (btnBgMusic) {
    btnBgMusic.addEventListener('click', () => {
      const nextState = !window.geoAudio.bgEnabled;
      window.geoAudio.setBackgroundEnabled(nextState);
      const t = I18N[currentLang];
      if (nextState) {
        btnBgMusic.textContent = t.bgMusicOn;
        btnBgMusic.classList.add('active');
        btnBgMusic.classList.remove('off');
      } else {
        btnBgMusic.textContent = t.bgMusicOff;
        btnBgMusic.classList.remove('active');
        btnBgMusic.classList.add('off');
      }
    });
  }

  function setVoiceGuideState(enabled, speakFromStart = true) {
    voiceGuideEnabled = enabled;
    const t = I18N[currentLang];
    if (btnVoiceGuide) {
      btnVoiceGuide.setAttribute('aria-pressed', String(voiceGuideEnabled));
      if (voiceGuideEnabled) {
        btnVoiceGuide.textContent = t.voiceGuideOn;
        btnVoiceGuide.classList.add('active');
        btnVoiceGuide.classList.remove('off');
      } else {
        btnVoiceGuide.textContent = t.voiceGuideOff;
        btnVoiceGuide.classList.remove('active');
        btnVoiceGuide.classList.add('off');
      }
    }

    if (voiceGuideEnabled) {
      if (speakFromStart) {
        updateImageIntro(currentDatasetKey, 'welcome');
      }
    } else if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  function toggleVoiceGuide() {
    const isCurrentlySpeaking = ('speechSynthesis' in window) && window.speechSynthesis.speaking;
    if (voiceGuideEnabled && isCurrentlySpeaking) {
      // Si está hablando actualmente, detener la narración
      setVoiceGuideState(false, false);
    } else if (!voiceGuideEnabled) {
      // Si estaba apagada, encender y reiniciar la narración desde el principio
      setVoiceGuideState(true, true);
    } else {
      // Si estaba encendida pero ya había terminado de hablar, apagar o reiniciar según estado
      setVoiceGuideState(false, false);
    }
  }

  if (btnVoiceGuide) {
    btnVoiceGuide.addEventListener('click', toggleVoiceGuide);
  }

  // Atajos de teclado accesibles para personas no videntes:
  // - Barra espaciadora (Space): Iniciar / Detener el escáner satelital
  // - Cualquier tecla de letra (A-Z, Ñ): Detener la narración si está hablando, o reiniciarla desde el principio
  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) {
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    if (e.code === 'Space') {
      e.preventDefault();
      if (isScanning) {
        stopScanner();
      } else {
        startScanner();
      }
    } else if (e.key && /^[a-zA-ZñÑ]$/.test(e.key)) {
      e.preventDefault();
      window.geoAudio.init();
      const isSpeaking = ('speechSynthesis' in window) && window.speechSynthesis.speaking;
      if (isSpeaking) {
        // Si la voz está sonando, cualquier tecla de letra la detiene de inmediato
        setVoiceGuideState(false, false);
      } else {
        // Si está en silencio o detenida, cualquier tecla de letra reinicia la narración desde el principio
        setVoiceGuideState(true, true);
      }
    }
  });

  // Iniciar suavemente la banda sonora de fondo y asegurar la bienvenida hablada en el primer gesto
  const unlockAudioOnFirstGesture = (e) => {
    window.geoAudio.init();
    const isVoiceBtn = e && e.target && e.target.closest('#btnVoiceGuide');
    const isLangBtn = e && e.target && e.target.closest('.lang-option');
    const isLetterKey = e && e.type === 'keydown' && e.key && /^[a-zA-ZñÑ]$/.test(e.key);
    if (voiceGuideEnabled && !hasSpokenInitialWelcome && !isVoiceBtn && !isLangBtn && !isLetterKey) {
      if (!('speechSynthesis' in window) || !window.speechSynthesis.speaking) {
        updateImageIntro(currentDatasetKey, 'welcome');
      }
    }
  };
  document.addEventListener('pointerdown', unlockAudioOnFirstGesture, { once: true });
  document.addEventListener('keydown', unlockAudioOnFirstGesture, { once: true });

  // ==========================================
  // 4. Modo DJ Táctil (Interacción con Mouse/Touch)
  // ==========================================
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    cursorPulse.style.left = `${x}px`;
    cursorPulse.style.top = `${y}px`;
    cursorPulse.style.opacity = '1';

    if (crosshairX && crosshairY) {
      crosshairX.style.top = `${y}px`;
      crosshairX.style.opacity = '1';

      crosshairY.style.left = `${x}px`;
      crosshairY.style.opacity = '1';
    }

    if (!isScanning) {
      samplePixelAndPlay(x, y, false);
    }
  });

  canvas.addEventListener('mouseleave', () => {
    cursorPulse.style.opacity = '0';
    if (crosshairX && crosshairY) {
      crosshairX.style.opacity = '0';
      crosshairY.style.opacity = '0';
    }
  });

  canvas.addEventListener('mouseenter', () => {
    cursorPulse.style.opacity = '1';
    if (crosshairX && crosshairY) {
      crosshairX.style.opacity = '1';
      crosshairY.style.opacity = '1';
    }
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(e.clientX - rect.left);
    const y = Math.floor(e.clientY - rect.top);

    cursorPulse.style.left = `${x}px`;
    cursorPulse.style.top = `${y}px`;
    cursorPulse.classList.remove('pulsing');
    void cursorPulse.offsetWidth;
    cursorPulse.classList.add('pulsing');

    samplePixelAndPlay(x, y, true);
  });

  function samplePixelAndPlay(x, y, forcePlay = false) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;

    try {
      const sampleSize = 3;
      const half = Math.floor(sampleSize / 2);
      const startX = Math.max(0, x - half);
      const startY = Math.max(0, y - half);
      const w = Math.min(canvas.width - startX, sampleSize);
      const h = Math.min(canvas.height - startY, sampleSize);

      const imgData = ctx.getImageData(startX, startY, w, h).data;
      let sumR = 0, sumG = 0, sumB = 0, count = 0;

      for (let i = 0; i < imgData.length; i += 4) {
        sumR += imgData[i];
        sumG += imgData[i + 1];
        sumB += imgData[i + 2];
        count++;
      }

      const r = Math.round(sumR / count);
      const g = Math.round(sumG / count);
      const b = Math.round(sumB / count);

      const yRatio = y / canvas.height;
      const noteData = window.geoAudio.mapPixelToMusicalNote(r, g, b, yRatio);

      updateTelemetry(x, y, r, g, b, noteData);

      const now = performance.now();
      const interval = (60 / bpm) * 1000 / 2;
      if (forcePlay || (now - lastSoundTime > interval && noteData.active)) {
        window.geoAudio.playTone(noteData.freq, 0.28, noteData.volume, noteData.timbreHint);
        lastSoundTime = now;
      }
    } catch (err) {
      // Ignorar si el canvas aún se está inicializando
    }
  }

  function updateTelemetry(x, y, r, g, b, noteData) {
    const lat = (90 - (y / canvas.height) * 180).toFixed(1);
    const lon = ((x / canvas.width) * 360 - 180).toFixed(1);
    telemCoords.textContent = `Lat: ${lat}° | Lon: ${lon}°`;

    telemRGB.textContent = `RGB: [${r}, ${g}, ${b}]`;
    colorSwatch.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;

    const t = I18N[currentLang];
    if (noteData.active) {
      telemNote.textContent = noteData.note;
      telemFreq.textContent = `${noteData.freq.toFixed(1)} Hz`;
      if (noteData.category) {
        const brightText = noteData.brightnessPct !== undefined ? `[${t.brightness}: ${noteData.brightnessPct}%]` : '';
        telemDesc.textContent = `${noteData.category} ${brightText} • ${t.pitch}: ${noteData.note} (${noteData.freq.toFixed(1)} Hz)`;
      }
    } else {
      telemNote.textContent = t.silence;
      telemFreq.textContent = '0.0 Hz';
    }
  }

  // ==========================================
  // 5. Modo Escáner Satelital Láser
  // ==========================================
  btnPlay.addEventListener('click', () => {
    startScanner();
  });

  btnStop.addEventListener('click', () => {
    stopScanner();
  });

  function startScanner() {
    if (isScanning) return;
    isScanning = true;
    scanLine.classList.add('active');
    btnPlay.style.display = 'none';
    btnStop.style.display = 'inline-block';
    modeBadge.textContent = I18N[currentLang].modeScanner;
    modeBadge.style.borderColor = '#ff007f';
    modeBadge.style.color = '#ff007f';

    scanX = 0;
    scanStartTime = performance.now();
    lastStepIndex = -1;
    lastSoundTime = performance.now();
    runScanLoop();
  }

  function stopScanner() {
    isScanning = false;
    scanLine.classList.remove('active');
    btnPlay.style.display = 'inline-block';
    btnStop.style.display = 'none';
    modeBadge.textContent = I18N[currentLang].modeTouch;
    modeBadge.style.borderColor = 'rgba(0, 243, 255, 0.4)';
    modeBadge.style.color = 'var(--accent-cyan)';
    if (scanAnimationId) {
      cancelAnimationFrame(scanAnimationId);
    }
  }

  let lastStepIndex = -1;
  let scanStartTime = performance.now();

  function runScanLoop() {
    if (!isScanning) return;

    const now = performance.now();
    const beatDurationMs = (60 / bpm) * 1000;
    const totalScanDurationMs = beatDurationMs * 16;

    const elapsed = (now - scanStartTime) % totalScanDurationMs;
    const progress = elapsed / totalScanDurationMs;

    scanX = progress * canvas.width;
    scanLine.style.left = `${scanX}px`;

    const currentStep = Math.floor(progress * 32);

    if (currentStep !== lastStepIndex) {
      lastStepIndex = currentStep;

      const sampleHeights = [
        { y: Math.floor(canvas.height * 0.25), lat: 'Norte' },
        { y: Math.floor(canvas.height * 0.50), lat: 'Ecuador' },
        { y: Math.floor(canvas.height * 0.75), lat: 'Sur' }
      ];

      let bestNote = null;
      let maxIntensity = -1;
      let bestRGB = [0, 0, 0];
      let bestY = canvas.height * 0.5;

      sampleHeights.forEach(item => {
        try {
          const pixel = ctx.getImageData(Math.floor(scanX), item.y, 1, 1).data;
          const r = pixel[0], g = pixel[1], b = pixel[2];
          const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

          if (luminance > maxIntensity && (r > 15 || g > 15 || b > 15)) {
            maxIntensity = luminance;
            bestY = item.y;
            bestRGB = [r, g, b];
            bestNote = window.geoAudio.mapPixelToMusicalNote(r, g, b, bestY / canvas.height);
          }
        } catch (e) {}
      });

      if (bestNote && bestNote.active) {
        const noteDuration = (beatDurationMs / 1000) * 0.75;
        window.geoAudio.playTone(bestNote.freq, noteDuration, bestNote.volume, bestNote.timbreHint);
        updateTelemetry(Math.floor(scanX), bestY, bestRGB[0], bestRGB[1], bestRGB[2], bestNote);
      } else {
        updateTelemetry(Math.floor(scanX), Math.floor(canvas.height * 0.5), 5, 10, 30, { active: false, note: I18N[currentLang].silence, freq: 0 });
      }
    }

    scanAnimationId = requestAnimationFrame(runScanLoop);
  }
});
