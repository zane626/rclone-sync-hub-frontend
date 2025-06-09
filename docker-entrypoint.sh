#!/bin/sh

# Replace API_URL in the built JavaScript files
if [ ! -z "$API_URL" ]; then
    echo "Configuring API URL to: $API_URL"
    sed -i "s|\${API_URL}|$API_URL|g" /etc/nginx/conf.d/default.conf

# Execute CMD
exec "$@"
