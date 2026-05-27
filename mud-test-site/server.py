from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import os

class Handler(SimpleHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        if length:
            self.rfile.read(length)

        self.send_response(204)
        self.end_headers()

if __name__ == "__main__":
    os.chdir("site")
    server = ThreadingHTTPServer(("0.0.0.0", 18080), Handler)
    print("MUD test site running: http://localhost:18080")
    server.serve_forever()
