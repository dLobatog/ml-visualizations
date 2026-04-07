import http.server
import os
import sys

port = int(os.environ.get('PORT', 8765))
os.chdir('/Users/dlobatog/Desktop/ml-visualizations')
handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('', port), handler)
print(f"Serving on port {port} from {os.getcwd()}")
httpd.serve_forever()
