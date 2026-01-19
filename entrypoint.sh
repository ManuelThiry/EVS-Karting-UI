#!/bin/sh
set -e

echo "window.env = { VITE_API_BASE_URL: '$(printenv VITE_API_BASE_URL)' };" > /usr/share/nginx/html/env.js

exec "$@"
