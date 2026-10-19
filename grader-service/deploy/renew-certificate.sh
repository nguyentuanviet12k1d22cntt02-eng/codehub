#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVICE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$SERVICE_DIR"

docker compose -f docker-compose.ec2.yml --profile tools run --rm certbot \
  renew --no-random-sleep-on-renew --preferred-profile shortlived \
  --webroot --webroot-path /var/www/certbot
docker compose -f docker-compose.ec2.yml exec -T nginx nginx -s reload
