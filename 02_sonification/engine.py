"""
NASA GeoBeats - Módulo de Sonificación y Mapeo Lógico (02_sonification)
Convierte matrices de imágenes satelitales en parámetros y eventos musicales
utilizando escalas diatónicas Mayores y Menores completas.
"""

import numpy as np
from PIL import Image

CHROMATIC_NOTES = [
    ("C", "Do", 0),
    ("C#", "Do#", 1),
    ("D", "Re", 2),
    ("Eb", "Mib", 3),
    ("E", "Mi", 4),
    ("F", "Fa", 5),
    ("F#", "Fa#", 6),
    ("G", "Sol", 7),
    ("Ab", "Lab", 8),
    ("A", "La", 9),
    ("Bb", "Sib", 10),
    ("B", "Si", 11),
]

SCALE_INTERVALS = {
    "major": [0, 2, 4, 5, 7, 9, 11],  # Escala Mayor (Jónica: 7 notas)
    "minor": [0, 2, 3, 5, 7, 8, 10],  # Escala Menor Natural (Eólica: 7 notas)
}


def build_diatonic_scale(root_key="C", scale_type="major", num_degrees=15):
    """
    Construye una escala diatónica Mayor o Menor a partir de la nota tónica elegida (ej. 'C' = Do).
    """
    root_meta = next((n for n in CHROMATIC_NOTES if n[0] == root_key), CHROMATIC_NOTES[0])
    semitone_offset = root_meta[2]
    intervals = SCALE_INTERVALS.get(scale_type, SCALE_INTERVALS["major"])

    base_midi = 36 + semitone_offset if semitone_offset >= 6 else 48 + semitone_offset
    frequencies = []
    note_names = []

    for i in range(num_degrees):
        octave_offset = (i // 7) * 12
        degree_offset = intervals[i % 7]
        midi = base_midi + octave_offset + degree_offset
        freq = round(440.0 * (2.0 ** ((midi - 69) / 12.0)), 2)
        note_idx = midi % 12
        octave_num = (midi // 12) - 1
        key_name, solfege_name, _ = CHROMATIC_NOTES[note_idx]

        frequencies.append(freq)
        note_names.append(f"{solfege_name}{octave_num} ({key_name}{octave_num})")

    return frequencies, note_names


class SonificationEngine:
    def __init__(self, scale_type="major", root_key="C"):
        self.root_key = root_key
        self.scale_type = scale_type
        self.scale, self.note_names = build_diatonic_scale(root_key, scale_type)

    def set_scale(self, root_key="C", scale_type="major"):
        self.root_key = root_key
        self.scale_type = scale_type
        self.scale, self.note_names = build_diatonic_scale(root_key, scale_type)

    def map_pixel_to_audio(self, r, g, b, y_ratio=0.5):
        """
        Traduce los canales RGB y la posición geográfica vertical a parámetros de audio
        en la escala Mayor o Menor activa.
        """
        luminance = 0.299 * r + 0.587 * g + 0.114 * b

        # Filtro de silencio para fondo negro espacial
        if luminance < 10 and max(r, g, b) < 15:
            return {"frequency": 0, "note_name": "Silencio", "volume": 0.0, "active": False}

        # Luminosidad gobierna la altura en la escala diatónica (Oscuro = Grave | Claro = Agudo)
        norm_val = float(np.clip(luminance / 255.0, 0.0, 1.0))
        idx = int(np.clip(norm_val * len(self.scale), 0, len(self.scale) - 1))

        freq = self.scale[idx]
        note = self.note_names[idx] if idx < len(self.note_names) else f"{int(freq)}Hz"
        volume = float(np.clip(0.55 + norm_val * 0.4, 0.15, 0.95))

        return {
            "frequency": round(freq, 2),
            "note_name": note,
            "volume": round(volume, 2),
            "active": True,
            "scale": f"{self.root_key} {self.scale_type}",
            "r": int(r),
            "g": int(g),
            "b": int(b),
        }

    def process_image_scanline(self, image_path, x_ratio=0.5, num_bands=8):
        """
        Lee una columna vertical (scanline) de la imagen y la sintetiza en acordes zonales.
        """
        img = Image.open(image_path).convert("RGB")
        w, h = img.size
        target_x = int(np.clip(x_ratio * w, 0, w - 1))

        band_height = h // num_bands
        events = []

        for band_idx in range(num_bands):
            y_start = band_idx * band_height
            y_end = (band_idx + 1) * band_height
            y_mid = (y_start + y_end) // 2

            box = (max(0, target_x - 2), y_start, min(w, target_x + 3), y_end)
            patch = img.crop(box)
            arr = np.array(patch)

            if arr.size == 0:
                continue

            mean_rgb = arr.mean(axis=(0, 1))
            r, g, b = mean_rgb[0], mean_rgb[1], mean_rgb[2]

            y_ratio = y_mid / float(h)
            audio_props = self.map_pixel_to_audio(r, g, b, y_ratio)
            audio_props["band_index"] = band_idx
            audio_props["latitude_approx"] = round(90.0 - (y_ratio * 180.0), 1)
            events.append(audio_props)

        return events
