"""
NASA GeoBeats - Módulo de Síntesis de Sonido (03_sound_packs)
Generador de audio WAV y perfiles de osciladores para Cosmic Chiptune, Deep Atmosphere y Solar Synthwave.
"""

import numpy as np
import scipy.io.wavfile as wavfile
import os

SOUND_PACK_PROFILES = {
    "cosmic_chiptune": {
        "name": "Cosmic Chiptune",
        "description": "8-Bit Retro Arcade con onda cuadrada brillante y decaimiento rápido.",
        "wave_type": "square",
        "attack_ms": 5,
        "decay_ms": 120,
        "release_ms": 40
    },
    "deep_atmosphere": {
        "name": "Deep Atmosphere",
        "description": "Lo-Fi Espacial & Ambient Pad con onda sinusoidal y ataque suave.",
        "wave_type": "sine",
        "attack_ms": 80,
        "decay_ms": 250,
        "release_ms": 350
    },
    "solar_synthwave": {
        "name": "Solar Synthwave",
        "description": "Cyberpunk con ondas de diente de sierra, armónicos ricos y pulso rítmico.",
        "wave_type": "sawtooth",
        "attack_ms": 15,
        "decay_ms": 180,
        "release_ms": 100
    }
}

class AudioSynthesizer:
    def __init__(self, sample_rate=44100):
        self.sample_rate = sample_rate

    def generate_waveform(self, freq, duration_sec, wave_type="sine"):
        t = np.linspace(0, duration_sec, int(self.sample_rate * duration_sec), endpoint=False)
        
        if freq <= 0:
            return np.zeros_like(t)

        if wave_type == "sine":
            return np.sin(2 * np.pi * freq * t)
        elif wave_type == "square":
            return np.sign(np.sin(2 * np.pi * freq * t))
        elif wave_type == "sawtooth":
            # 2 * (t * f - floor(1/2 + t * f))
            return 2.0 * (t * freq - np.floor(0.5 + t * freq))
        elif wave_type == "triangle":
            return 2.0 * np.abs(2.0 * (t * freq - np.floor(0.5 + t * freq))) - 1.0
        else:
            return np.sin(2 * np.pi * freq * t)

    def apply_envelope(self, signal, attack_ms=10, decay_ms=100, release_ms=50):
        n = len(signal)
        att_samples = int(self.sample_rate * (attack_ms / 1000.0))
        rel_samples = int(self.sample_rate * (release_ms / 1000.0))
        
        envelope = np.ones(n)
        
        # Ataque
        if att_samples > 0 and att_samples < n:
            envelope[:att_samples] = np.linspace(0, 1, att_samples)
            
        # Liberación
        if rel_samples > 0 and rel_samples < n:
            envelope[-rel_samples:] = np.linspace(1, 0, rel_samples)
            
        return signal * envelope

    def render_tone(self, freq, duration_sec=0.25, pack="cosmic_chiptune", volume=0.8):
        profile = SOUND_PACK_PROFILES.get(pack, SOUND_PACK_PROFILES["cosmic_chiptune"])
        wave = self.generate_waveform(freq, duration_sec, profile["wave_type"])
        shaped = self.apply_envelope(
            wave,
            profile["attack_ms"],
            profile["decay_ms"],
            profile["release_ms"]
        )
        return shaped * volume

    def save_wav(self, audio_data, output_path):
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        # Normalizar a int16 para formato WAV estándar
        max_val = np.max(np.abs(audio_data))
        if max_val > 0:
            norm = (audio_data / max_val) * 0.9
        else:
            norm = audio_data
        int_data = (norm * 32767).astype(np.int16)
        wavfile.write(output_path, self.sample_rate, int_data)
        return output_path
