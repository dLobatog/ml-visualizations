#!/bin/bash
cd /Users/dlobatog/Desktop/ml-visualizations
exec python3 -m http.server ${PORT:-8766}
