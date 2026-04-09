import http.server
import os
import sys

port = int(os.environ.get('PORT', 8765))
d = '/Users/dlobatog/Desktop/ml-visualizations'

class H(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        import posixpath, urllib.parse
        path = urllib.parse.unquote(urllib.parse.urlparse(path).path)
        path = posixpath.normpath(path)
        parts = path.split('/')
        parts = [p for p in parts if p and p not in ('.', '..')]
        result = d
        for p in parts:
            result = os.path.join(result, p)
        print(f"[DEBUG] translate_path: {self.path} -> {result} (exists: {os.path.exists(result)})", flush=True)
        return result

httpd = http.server.HTTPServer(('', port), H)
print(f"Serving on port {port} from {d}", flush=True)
print(f"index.html exists: {os.path.exists(os.path.join(d, 'index.html'))}", flush=True)
httpd.serve_forever()
