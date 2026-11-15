/**
 * NASA GeoBeats - Motor de Audio en Tiempo Real Multigénero (audio.js)
 * Sistema de Sonificación Científico con Escalas Mayores y Menores Diatónicas,
 * Selección de Tonalidad (C/Do, D/Re, E/Mi, etc.) y Banda Sonora Armónica de Fondo.
 */

// Definición de las 12 notas cromáticas con notación anglosajona y latina (Solfeo)
const CHROMATIC_NOTES = [
  { key: 'C',  solfege: 'Do',  semitone: 0 },
  { key: 'C#', solfege: 'Do#', semitone: 1 },
  { key: 'D',  solfege: 'Re',  semitone: 2 },
  { key: 'Eb', solfege: 'Mib', semitone: 3 },
  { key: 'E',  solfege: 'Mi',  semitone: 4 },
  { key: 'F',  solfege: 'Fa',  semitone: 5 },
  { key: 'F#', solfege: 'Fa#', semitone: 6 },
  { key: 'G',  solfege: 'Sol', semitone: 7 },
  { key: 'Ab', solfege: 'Lab', semitone: 8 },
  { key: 'A',  solfege: 'La',  semitone: 9 },
  { key: 'Bb', solfege: 'Sib', semitone: 10 },
  { key: 'B',  solfege: 'Si',  semitone: 11 }
];

// Intervalos en semitonos para escalas diatónicas de 7 notas (no pentatónicas)
const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11], // Escala Mayor Natural (Jónica: T - T - ST - T - T - T - ST)
  minor: [0, 2, 3, 5, 7, 8, 10]  // Escala Menor Natural (Eólica: T - ST - T - T - ST - T - T)
};

/**
 * Convierte un número de nota MIDI a frecuencia en Hz (A4 = MIDI 69 = 440 Hz)
 */
function midiToFreq(midi) {
  return Number((440 * Math.pow(2, (midi - 69) / 12)).toFixed(2));
}

/**
 * Construye una escala diatónica completa (Mayor o Menor) a lo largo de más de 2 octavas (15 grados)
 * a partir de la tónica elegida (ej. 'C' = Do) y el modo ('major' o 'minor').
 */
function buildDiatonicScale(rootKey = 'C', mode = 'major') {
  const rootObj = CHROMATIC_NOTES.find(n => n.key === rootKey) || CHROMATIC_NOTES[0];
  const intervals = SCALE_INTERVALS[mode] || SCALE_INTERVALS.major;

  // Para mantener un registro equilibrado y cálido:
  // de C a F iniciamos en la octava 3 (MIDI 48 = C3 = 130.81Hz); de F# a B iniciamos en la octava 2 (ej. A2 = 110Hz)
  const baseMidi = rootObj.semitone >= 6 ? 36 + rootObj.semitone : 48 + rootObj.semitone;
  const scale = [];

  // Generamos 15 grados diatónicos (2 octavas completas de 7 notas + tónica superior)
  for (let i = 0; i < 15; i++) {
    const octaveOffset = Math.floor(i / 7) * 12;
    const degreeOffset = intervals[i % 7];
    const midi = baseMidi + octaveOffset + degreeOffset;
    const noteIndex = ((midi % 12) + 12) % 12;
    const octaveNumber = Math.floor(midi / 12) - 1;
    const noteMeta = CHROMATIC_NOTES[noteIndex];

    scale.push({
      note: `${noteMeta.solfege}${octaveNumber} (${noteMeta.key}${octaveNumber})`,
      shortNote: `${noteMeta.solfege}${octaveNumber}`,
      key: noteMeta.key,
      solfege: noteMeta.solfege,
      octave: octaveNumber,
      midi: midi,
      freq: midiToFreq(midi),
      degree: (i % 7) + 1
    });
  }

  return scale;
}

class GeoAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.interactiveGain = null;
    this.bgMasterGain = null;
    this.currentPack = 'chiptune';
    this.rootKey = 'C';     // Por defecto Do (C)
    this.scaleMode = 'major'; // 'major' (Mayor) o 'minor' (Menor)
    this.lang = 'es';       // Idioma activo: 'es' o 'en'
    this.activeScale = buildDiatonicScale(this.rootKey, this.scaleMode);
    this.isMuted = false;
    this.volume = 0.8;      // Volumen del sonido interactivo (80% por defecto)
    this.bgEnabled = true;
    this.bgSliderRatio = 0.5; // Posición del slider de fondo (50% por defecto = nivel ideal 0.128)
    this.bgMaxGain = 0.256;   // Al 50% (0.5 * 0.256) da exactamente 0.128 (0.8 * 0.16)
    this.bgVolume = this.bgSliderRatio * this.bgMaxGain;
    this.bgNodes = null;
    this.bgProgressionTimer = null;
    this.bgChordIndex = 0;
    this.lastFrequency = null; // Para suavizado de portamento (evitar saltos bruscos)
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Bus dedicado para las Notas Interactivas del Mapa
      this.interactiveGain = this.ctx.createGain();
      this.interactiveGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.interactiveGain.connect(this.masterGain);

      // Bus dedicado e independiente para la Banda Sonora Armónica de Fondo
      this.bgMasterGain = this.ctx.createGain();
      this.bgMasterGain.gain.setValueAtTime(this.bgEnabled ? this.bgVolume : 0, this.ctx.currentTime);
      this.bgMasterGain.connect(this.masterGain);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.bgEnabled && !this.bgNodes) {
      this.startBackgroundMusic(this.currentPack);
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.interactiveGain && this.ctx) {
      this.interactiveGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Ajusta el volumen de la banda sonora de fondo de forma independiente.
   * sliderRatio va de 0.0 (0%) a 1.0 (100%), donde 0.5 (50%) equivale al nivel ideal por defecto.
   */
  setBackgroundVolume(sliderRatio) {
    this.bgSliderRatio = Math.max(0, Math.min(1, sliderRatio));
    this.bgVolume = this.bgSliderRatio * this.bgMaxGain;
    this.init();
    if (this.bgMasterGain && this.ctx && this.bgEnabled) {
      this.bgMasterGain.gain.setTargetAtTime(this.bgVolume, this.ctx.currentTime, 0.06);
    }
  }

  /**
   * Cambia la Tónica (ej. 'C' = Do, 'D' = Re, 'A' = La) y/o el Modo ('major' = Mayor, 'minor' = Menor).
   * Reconstruye la escala diatónica y actualiza en armonía la banda sonora de fondo.
   */
  setScale(rootKey, mode = this.scaleMode) {
    const changed = (this.rootKey !== rootKey) || (this.scaleMode !== mode);
    this.rootKey = rootKey;
    this.scaleMode = mode;
    this.activeScale = buildDiatonicScale(this.rootKey, this.scaleMode);

    if (this.ctx && this.bgEnabled && changed) {
      this.startBackgroundMusic(this.currentPack);
    }
    return this.getScaleLabel();
  }

  setLanguage(lang) {
    this.lang = lang === 'en' ? 'en' : 'es';
    return this.getScaleLabel();
  }

  getScaleLabel(lang = this.lang) {
    const rootObj = CHROMATIC_NOTES.find(n => n.key === this.rootKey) || CHROMATIC_NOTES[0];
    if (lang === 'en') {
      const modeLabel = this.scaleMode === 'minor' ? 'Minor' : 'Major';
      return `${rootObj.key} ${modeLabel} (${rootObj.solfege})`;
    }
    const modeLabel = this.scaleMode === 'minor' ? 'Menor' : 'Mayor';
    return `${rootObj.key} (${rootObj.solfege} ${modeLabel})`;
  }

  setBackgroundEnabled(enabled) {
    this.bgEnabled = enabled;
    this.init();
    if (!this.ctx || !this.bgMasterGain) return;
    const now = this.ctx.currentTime;
    if (this.bgEnabled) {
      if (!this.bgNodes) {
        this.startBackgroundMusic(this.currentPack);
      }
      this.bgMasterGain.gain.setTargetAtTime(this.bgVolume, now, 0.4);
    } else {
      this.bgMasterGain.gain.setTargetAtTime(0.0001, now, 0.3);
    }
  }

  setSoundPack(packName) {
    const changed = this.currentPack !== packName;
    this.currentPack = packName;
    if (this.ctx && this.bgEnabled && (changed || !this.bgNodes)) {
      this.startBackgroundMusic(packName);
    }
  }

  /**
   * Construye las frecuencias del colchón continuo (drone) y la progresión de acordes
   * utilizando los grados exactos de la escala Mayor o Menor activa.
   */
  buildHarmonicProgressionForCurrentScale(packName) {
    const s = this.activeScale;
    // Grados de la primera octava (índices 0..6) y segunda octava (índices 7..13)
    // s[0] = I, s[1] = II, s[2] = III, s[3] = IV, s[4] = V, s[5] = VI, s[6] = VII
    const rootLow = s[0].freq * 0.5; // Tónica una octava abajo para cuerpo grave
    const rootMid = s[0].freq;       // Grado I
    const thirdMid = s[2].freq;      // Grado III (define el carácter Mayor o Menor)
    const fifthMid = s[4].freq;      // Grado V (quinta justa consonante)
    const octaveHigh = s[7].freq;    // Grado I (octava superior)

    // Acordes diatónicos construidos sobre la escala seleccionada:
    // En Modo Mayor: I -> V -> vi -> IV (ej. en Do Mayor: Do -> Sol -> La menor -> Fa)
    // En Modo Menor: i -> VI -> III -> VII (ej. en Do Menor: Do menor -> Lab Mayor -> Mib Mayor -> Sib Mayor)
    let chords;
    if (this.scaleMode === 'major') {
      if (packName === 'jazz' || packName === 'lofi') {
        // Acordes diatónicos con 7ma mayor / menor (Imaj7 -> IVmaj7 -> vi7 -> V6)
        chords = [
          [s[0].freq, s[2].freq, s[4].freq, s[6].freq], // Imaj7 (Do - Mi - Sol - Si)
          [s[3].freq, s[5].freq, s[7].freq, s[9].freq], // IVmaj7 (Fa - La - Do - Mi)
          [s[5].freq, s[7].freq, s[9].freq, s[11].freq], // vi7 (La - Do - Mi - Sol)
          [s[4].freq, s[6].freq, s[8].freq, s[9].freq]  // V6 (Sol - Si - Re - Mi)
        ];
      } else {
        // Tríadas diatónicas amplias y consonantes (I -> V -> vi -> IV)
        chords = [
          [s[0].freq, s[2].freq, s[4].freq, s[7].freq], // I (Do - Mi - Sol - Do)
          [s[4].freq, s[6].freq, s[8].freq],            // V (Sol - Si - Re)
          [s[5].freq, s[7].freq, s[9].freq],            // vi (La - Do - Mi)
          [s[3].freq, s[5].freq, s[7].freq]             // IV (Fa - La - Do)
        ];
      }
    } else {
      // Modo Menor Natural (Eólico)
      if (packName === 'jazz' || packName === 'lofi') {
        // Acordes menores con 7ma (im7 -> VImaj7 -> iv7 -> VII6)
        chords = [
          [s[0].freq, s[2].freq, s[4].freq, s[6].freq], // im7 (Do - Mib - Sol - Sib)
          [s[5].freq, s[7].freq, s[9].freq, s[11].freq], // VImaj7 (Lab - Do - Mib - Sol)
          [s[3].freq, s[5].freq, s[7].freq, s[9].freq], // iv7 (Fa - Lab - Do - Mib)
          [s[6].freq, s[8].freq, s[10].freq, s[11].freq] // VII (Sib - Re - Fa - Sol)
        ];
      } else {
        // Progresión épica menor (i -> VI -> III -> VII)
        chords = [
          [s[0].freq, s[2].freq, s[4].freq, s[7].freq], // i (Do - Mib - Sol - Do)
          [s[5].freq, s[7].freq, s[9].freq],            // VI (Lab - Do - Mib)
          [s[2].freq, s[4].freq, s[6].freq],            // III (Mib - Sol - Sib)
          [s[6].freq, s[8].freq, s[10].freq]            // VII (Sib - Re - Fa)
        ];
      }
    }

    return {
      droneFreqs: [rootLow, rootMid, thirdMid, fifthMid, octaveHigh],
      chords
    };
  }

  /**
   * Configuraciones tímbricas de la Banda Sonora de Fondo para cada Sound Pack,
   * sincronizadas con la escala Mayor o Menor activa.
   */
  getBackgroundPreset(packName) {
    const harmony = this.buildHarmonicProgressionForCurrentScale(packName);

    const presets = {
      // 1. Cosmic Chiptune: Ondas triangle/sine suaves con arpegio de acordes 8-bit
      chiptune: {
        droneFreqs: [harmony.droneFreqs[1], harmony.droneFreqs[2], harmony.droneFreqs[3]],
        waveTypes: ['triangle', 'triangle', 'sine'],
        filterCutoff: 420,
        lfoRate: 0.18,
        lfoDepth: 90,
        chordIntervalMs: 3200,
        swellAttack: 0.6,
        swellRelease: 2.2,
        swellWave: 'triangle',
        chords: harmony.chords
      },
      // 2. Deep Atmosphere: Pad cósmico binaural con séptimas y respiración lenta
      lofi: {
        droneFreqs: [harmony.droneFreqs[1], harmony.droneFreqs[2], harmony.droneFreqs[3], harmony.droneFreqs[4]],
        waveTypes: ['sine', 'sine', 'triangle', 'sine'],
        filterCutoff: 340,
        lfoRate: 0.08,
        lfoDepth: 110,
        chordIntervalMs: 4200,
        swellAttack: 1.4,
        swellRelease: 3.4,
        swellWave: 'sine',
        chords: harmony.chords
      },
      // 3. Solar Synthwave: Pad analógico Vangelis / Cyberpunk con sub-bajo y barrido de filtro
      synthwave: {
        droneFreqs: [harmony.droneFreqs[0], harmony.droneFreqs[1], harmony.droneFreqs[2], harmony.droneFreqs[3]],
        waveTypes: ['sawtooth', 'triangle', 'sawtooth', 'triangle'],
        filterCutoff: 310,
        lfoRate: 0.14,
        lfoDepth: 140,
        chordIntervalMs: 3400,
        swellAttack: 0.9,
        swellRelease: 2.6,
        swellWave: 'sawtooth',
        chords: harmony.chords
      },
      // 4. Earth Jazz: Piano eléctrico Rhodes cálido con acordes de 7ma diatónicos
      jazz: {
        droneFreqs: [harmony.droneFreqs[0], harmony.droneFreqs[1], harmony.droneFreqs[2], harmony.droneFreqs[3]],
        waveTypes: ['sine', 'triangle', 'sine', 'triangle'],
        filterCutoff: 440,
        lfoRate: 0.22,
        lfoDepth: 80,
        chordIntervalMs: 3600,
        swellAttack: 0.8,
        swellRelease: 2.8,
        swellWave: 'triangle',
        chords: harmony.chords
      },
      // 5. Orbital Rock: Órgano y colchón Space-Rock (estilo Pink Floyd)
      rock: {
        droneFreqs: [harmony.droneFreqs[0], harmony.droneFreqs[1], harmony.droneFreqs[3], harmony.droneFreqs[4]],
        waveTypes: ['triangle', 'sawtooth', 'triangle', 'sine'],
        filterCutoff: 360,
        lfoRate: 0.12,
        lfoDepth: 100,
        chordIntervalMs: 3500,
        swellAttack: 0.8,
        swellRelease: 2.5,
        swellWave: 'triangle',
        chords: harmony.chords
      },
      // 6. Cinematic: Cuerdas sinfónicas y pedal de órgano estilo Hans Zimmer
      cinematic: {
        droneFreqs: [harmony.droneFreqs[0], harmony.droneFreqs[1], harmony.droneFreqs[2], harmony.droneFreqs[3]],
        waveTypes: ['sine', 'triangle', 'sawtooth', 'sine'],
        filterCutoff: 380,
        lfoRate: 0.09,
        lfoDepth: 120,
        chordIntervalMs: 4000,
        swellAttack: 1.5,
        swellRelease: 3.5,
        swellWave: 'triangle',
        chords: harmony.chords
      }
    };
    return presets[packName] || presets.chiptune;
  }

  /**
   * Inicia o transiciona suavemente (crossfade) la banda sonora armónica de fondo
   * según el Sound Pack y la Escala (Mayor/Menor) elegidos.
   */
  startBackgroundMusic(packName = this.currentPack) {
    if (!this.ctx || !this.bgMasterGain) return;
    this.stopBackgroundMusic();
    if (!this.bgEnabled) return;

    const preset = this.getBackgroundPreset(packName);
    const now = this.ctx.currentTime;

    const packGain = this.ctx.createGain();
    packGain.gain.setValueAtTime(0.0001, now);
    packGain.gain.linearRampToValueAtTime(1.0, now + 1.2); // Fade-in suave de 1.2s

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(preset.filterCutoff, now);
    filter.Q.setValueAtTime(1.2, now);

    // LFO para dar movimiento orgánico ("respiración") al filtro de la banda sonora
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(preset.lfoRate, now);
    lfoGain.gain.setValueAtTime(preset.lfoDepth, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start(now);

    const oscillators = [];
    preset.droneFreqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = preset.waveTypes[idx % preset.waveTypes.length];
      osc.frequency.setValueAtTime(freq, now);
      // Ligera desafinación cálida (efecto chorus natural)
      osc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * (idx * 2.5), now);

      const voiceLevel = idx === 0 ? 0.30 : 0.18;
      oscGain.gain.setValueAtTime(voiceLevel, now);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      oscillators.push(osc);
    });

    filter.connect(packGain);
    packGain.connect(this.bgMasterGain);

    this.bgNodes = {
      packGain,
      filter,
      lfo,
      oscillators
    };

    this.bgChordIndex = 0;
    this.triggerBackgroundChordSwell(preset, filter);
    this.bgProgressionTimer = setInterval(() => {
      if (this.ctx && this.bgEnabled && this.ctx.state === 'running' && this.bgNodes) {
        this.triggerBackgroundChordSwell(preset, filter);
      }
    }, preset.chordIntervalMs);
  }

  /**
   * Genera una ola de acordes suave (swell) dentro de la progresión diatónica actual
   */
  triggerBackgroundChordSwell(preset, targetFilter) {
    if (!this.ctx || !preset.chords || preset.chords.length === 0) return;
    const chord = preset.chords[this.bgChordIndex % preset.chords.length];
    this.bgChordIndex++;

    const now = this.ctx.currentTime;
    const totalDur = preset.swellAttack + preset.swellRelease;

    chord.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const voiceGain = this.ctx.createGain();

      osc.type = preset.swellWave || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.detune.setValueAtTime((i - 1) * 4, now);

      const peakGain = 0.12 / chord.length;
      voiceGain.gain.setValueAtTime(0.0001, now);
      voiceGain.gain.linearRampToValueAtTime(peakGain, now + preset.swellAttack);
      voiceGain.gain.exponentialRampToValueAtTime(0.0001, now + totalDur);

      osc.connect(voiceGain);
      voiceGain.connect(targetFilter);

      osc.start(now);
      osc.stop(now + totalDur + 0.05);
    });
  }

  stopBackgroundMusic() {
    if (this.bgProgressionTimer) {
      clearInterval(this.bgProgressionTimer);
      this.bgProgressionTimer = null;
    }
    if (this.bgNodes && this.ctx) {
      const now = this.ctx.currentTime;
      const oldNodes = this.bgNodes;
      this.bgNodes = null;
      try {
        oldNodes.packGain.gain.cancelScheduledValues(now);
        oldNodes.packGain.gain.setValueAtTime(Math.max(0.0001, oldNodes.packGain.gain.value), now);
        oldNodes.packGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        setTimeout(() => {
          try {
            oldNodes.lfo.stop();
            oldNodes.oscillators.forEach(o => o.stop());
            oldNodes.packGain.disconnect();
          } catch (e) {}
        }, 650);
      } catch (e) {}
    }
  }

  rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s, v: v };
  }

  /**
   * Mapeo Físico y Armónico Diatónico (Escalas Mayores y Menores completas):
   * Brillo gobierna la altura de la nota en la escala seleccionada (Oscuro = Grave | Claro = Agudo).
   * Color define el timbre, textura y categoría física.
   */
  mapPixelToMusicalNote(r, g, b, yRatio = 0.5) {
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    
    const isEn = this.lang === 'en';

    // Filtro para fondo negro del espacio
    if (luminance < 10 && Math.max(r, g, b) < 15) {
      return {
        active: false,
        note: '--',
        freq: 0,
        volume: 0,
        category: isEn ? 'Outer Space' : 'Espacio Exterior'
      };
    }

    const hsv = this.rgbToHsv(r, g, b);

    // 1. Usar la escala diatónica activa (Mayor o Menor en la tonalidad elegida por el usuario)
    const targetScale = this.activeScale;
    const totalNotes = targetScale.length;

    // 2. REGLA FUNDAMENTAL: LUMINOSIDAD = ALTURA DE NOTA
    // 0.0 (Oscuro) -> Graves | 1.0 (Claro) -> Agudos
    const brightnessRatio = Math.max(0, Math.min(1, luminance / 255));
    const normIndex = brightnessRatio;

    // 3. Determinar Categoría Ambiental y Timbre según color
    let category = isEn ? "Land Surface" : "Superficie Terrestre";
    let timbreHint = "standard";

    if ((b > r + 15 && b > g) || (hsv.h >= 180 && hsv.h <= 250 && hsv.s > 0.18)) {
      category = brightnessRatio < 0.25
        ? (isEn ? "🌊 Abyssal / Deep Ocean" : "🌊 Océano Abisal / Profundo")
        : (isEn ? "🌊 Ocean / Coastal Waters" : "🌊 Océano / Aguas Costeras");
      timbreHint = "bass";
    } else if (brightnessRatio > 0.72 && hsv.s < 0.28) {
      category = isEn ? "🏔️ Ice / Glacier / Snow" : "🏔️ Hielo / Glaciar / Nieve";
      timbreHint = "ice";
    } else if (g > r + 10 && g > b + 10) {
      category = isEn ? "🌿 Biomass / Rainforest" : "🌿 Biomasa / Selva Amazónica";
      timbreHint = "warm";
    } else if ((r > g + 25 && r > b + 25) || (hsv.h >= 340 || hsv.h <= 45 && hsv.s > 0.3)) {
      category = isEn ? "🔥 Thermal Anomaly / Wildfire" : "🔥 Anomalía Térmica / Fuego";
      timbreHint = "alarm";
    } else {
      category = brightnessRatio < 0.38
        ? (isEn ? "🏜️ Dark Valley / Bedrock" : "🏜️ Valle / Roca Oscura")
        : (isEn ? "🏜️ Arid Soil / Sand" : "🏜️ Suelo Árido / Arena");
      timbreHint = "dry";
    }

    const clampedIndex = Math.floor(Math.min(totalNotes - 1, Math.max(0, normIndex * totalNotes)));
    const selectedItem = targetScale[clampedIndex];
    const volume = 0.55 + brightnessRatio * 0.4;
    const displayNote = isEn
      ? `${selectedItem.key}${selectedItem.octave} (${selectedItem.solfege}${selectedItem.octave})`
      : selectedItem.note;

    return {
      active: true,
      note: displayNote,
      freq: selectedItem.freq,
      volume: volume,
      category: category,
      timbreHint: timbreHint,
      brightnessPct: Math.round(brightnessRatio * 100),
      scaleLabel: this.getScaleLabel()
    };
  }

  makeDistortionCurve(amount = 20) {
    const k = amount;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
      const x = (i * 2) / n_samples - 1;
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
  }

  /**
   * Dispara una nota musical con transición armónica suave (Portamento suave para evitar saltos bruscos)
   */
  playTone(freq, durationSec = 0.35, volumeScale = 0.8, timbreHint = "standard") {
    this.init();
    if (!freq || freq <= 0) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    // Suavizado de portamento: si había una nota previa cercana, desliza suavemente en 40ms
    if (this.lastFrequency && Math.abs(this.lastFrequency - freq) > 10 && Math.abs(this.lastFrequency - freq) < 300) {
      osc.frequency.setValueAtTime(this.lastFrequency, now);
      osc.frequency.exponentialRampToValueAtTime(freq, now + 0.045);
    } else {
      osc.frequency.setValueAtTime(freq, now);
    }
    this.lastFrequency = freq;

    // 1. COSMIC CHIPTUNE (Retro 8-bit)
    if (this.currentPack === 'chiptune') {
      osc.type = (timbreHint === 'bass') ? 'triangle' : 'square';

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volumeScale * 0.65, now + 0.015);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(noteGain);
      noteGain.connect(this.interactiveGain);
      osc.start(now);
      osc.stop(now + durationSec);

    // 2. DEEP ATMOSPHERE (Ambient / Lo-Fi)
    } else if (this.currentPack === 'lofi') {
      osc.type = 'sine';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const cutoff = (timbreHint === 'ice') ? 3500 : (timbreHint === 'bass' ? 450 : 1200);
      filter.frequency.setValueAtTime(cutoff, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volumeScale * 0.8, now + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.6);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.interactiveGain);
      osc.start(now);
      osc.stop(now + durationSec * 1.6);

    // 3. SOLAR SYNTHWAVE (Cyberpunk)
    } else if (this.currentPack === 'synthwave') {
      osc.type = 'sawtooth';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(timbreHint === 'alarm' ? 6 : 3, now);
      const startCutoff = (timbreHint === 'alarm') ? 700 : 350;
      const endCutoff = (timbreHint === 'alarm') ? 3500 : 1600;
      filter.frequency.setValueAtTime(startCutoff, now);
      filter.frequency.exponentialRampToValueAtTime(endCutoff, now + 0.07);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volumeScale * 0.7, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.2);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.interactiveGain);
      osc.start(now);
      osc.stop(now + durationSec * 1.2);

    // 4. EARTH JAZZ (Rhodes / Bossa)
    } else if (this.currentPack === 'jazz') {
      osc.type = 'triangle';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      const tremolo = this.ctx.createOscillator();
      const tremoloGain = this.ctx.createGain();
      tremolo.frequency.setValueAtTime(5, now);
      tremoloGain.gain.setValueAtTime(10, now);
      tremolo.connect(osc.frequency);
      tremolo.start(now);
      tremolo.stop(now + durationSec * 1.3);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volumeScale * 0.75, now + 0.04);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.3);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.interactiveGain);
      osc.start(now);
      osc.stop(now + durationSec * 1.3);

    // 5. ORBITAL ROCK (Distorsión y Overdrive)
    } else if (this.currentPack === 'rock') {
      osc.type = 'sawtooth';

      const distortion = this.ctx.createWaveShaper();
      distortion.curve = this.makeDistortionCurve(timbreHint === 'alarm' ? 25 : 10);
      distortion.oversample = '4x';

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(timbreHint === 'alarm' ? 4000 : 2500, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volumeScale * 0.65, now + 0.02);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.1);

      osc.connect(distortion);
      distortion.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.interactiveGain);
      osc.start(now);
      osc.stop(now + durationSec * 1.1);

    // 6. CINEMATIC MELODIC (Cuerdas Orquestales y Acordes)
    } else if (this.currentPack === 'cinematic') {
      osc.type = 'sine';

      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(freq * 0.5, now);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(timbreHint === 'ice' ? 3000 : 1300, now);

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(volumeScale * 0.8, now + 0.12);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec * 1.8);

      osc.connect(filter);
      subOsc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(this.interactiveGain);

      osc.start(now);
      subOsc.start(now);
      osc.stop(now + durationSec * 1.8);
      subOsc.stop(now + durationSec * 1.8);
    }
  }
}

// Instancia global
window.geoAudio = new GeoAudioEngine();
