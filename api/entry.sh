#!/bin/sh

# generate static files
python ./manage.py migrate

# generate static files
python ./manage.py collectstatic --clear --noinput

# Prepare log files
mkdir -p logs
touch logs/gunicorn.log
touch logs/access.log

# Start Gunicorn processes
echo Starting Gunicorn.

gunicorn wsgi:application \
    --bind 0.0.0.0:5000 \
    --workers 2 \
    --worker-class=gevent \
    --log-level debug \
    --capture-output \
    --log-file=./logs/gunicorn.log \
    --access-logfile=./logs/access.log \
    --forwarded-allow-ips "*" \
    --timeout 60

# output log file if exists
echo "$(cat ./logs/gunicorn.log)"
