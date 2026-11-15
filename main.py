"""
NASA GeoBeats - Lanzador Principal (main.py)
Levanta un servidor web local para visualizar y probar la Jukebox interactiva en el navegador,
o ejecutar la sonificación por línea de comandos.
"""

import os
import sys
import webbrowser
from http.server import HTTPServer, SimpleHTTPRequestHandler

DEFAULT_PORT = 8080
INTERFACE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "04_interface")


class ReusableHTTPServer(HTTPServer):
    allow_reuse_address = True


class GeoBeatsHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Servir archivos estáticos directamente desde la carpeta del proyecto
        base_dir = os.path.dirname(os.path.abspath(__file__))
        super().__init__(*args, directory=base_dir, **kwargs)

    def end_headers(self):
        # Evitar caché del navegador para cargar siempre los últimos cambios de JS/CSS/HTML
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        super().end_headers()


def create_server(start_port=DEFAULT_PORT, max_attempts=20):
    for port in range(start_port, start_port + max_attempts):
        try:
            httpd = ReusableHTTPServer(("", port), GeoBeatsHandler)
            return httpd, port
        except OSError:
            continue
    raise OSError(f"No se encontró un puerto libre entre {start_port} y {start_port + max_attempts - 1}.")


def run_server():
    httpd, active_port = create_server(DEFAULT_PORT)
    url = f"http://localhost:{active_port}/04_interface/index.html"

    print("=" * 65)
    print("🌍 INICIANDO NASA GEOBEATS: EARTH INFORMATION JUKEBOX")
    print("=" * 65)
    if active_port != DEFAULT_PORT:
        print(f"ℹ️  El puerto {DEFAULT_PORT} estaba ocupado; usando automáticamente el puerto {active_port}.")
    print(f"📡 Servidor activo en: {url}")
    print("✨ Presiona Ctrl+C en cualquier momento para detener el servidor.")
    print("=" * 65)

    # Abrir navegador automáticamente
    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n⏹ Servidor GeoBeats detenido correctamente. ¡Hasta la próxima misión!")
        httpd.server_close()
        sys.exit(0)


if __name__ == "__main__":
    run_server()
