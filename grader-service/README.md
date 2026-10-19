# LearnPython AWS Docker Grader

Project-owned isolated execution service for Python 3.11, JavaScript/Node.js 20,
C17 and C++17. It runs on the dedicated Ubuntu EC2 host and is called by the
Render backend over authenticated HTTPS.

## Security boundary

- The backend sends source code and stdin only. Expected output and hidden-answer
  data stay in the backend.
- The API accepts only fixed server-owned runner images and commands.
- Each submission batch gets one ephemeral container with no network, a read-only
  root filesystem, a non-root UID, dropped capabilities and bounded tmpfs storage.
- CPU, memory, PID, file, output and wall-clock limits are applied. The container
  is forcibly removed in a `finally` block.
- The Docker socket belongs only to the trusted API container. It is never mounted
  into a learner-code runner.
- Keep this EC2 instance dedicated to grading. Do not place the application
  database, AWS credentials or other secrets on it.

## Local verification

The contract tests do not need Docker:

```bash
cd grader-service
python -m unittest discover -s tests -v
```

Docker integration requires a running Linux Docker daemon:

```bash
cp .env.example .env
# Replace GRADER_API_TOKEN with a random value of at least 32 characters.
docker compose -f docker-compose.ec2.yml --profile runners build
docker compose -f docker-compose.ec2.yml up -d grader-api
curl http://127.0.0.1:8080/health/ready

# Full runner, failure-mode, isolation and queue checks:
set -a && . ./.env && set +a
python3 tests/test_docker_e2e.py
```

## EC2 deployment

1. Copy this directory to the dedicated Ubuntu EC2 host.
2. Create `.env` from `.env.example`, set a random `GRADER_API_TOKEN`, and keep
   `GRADER_MAX_CONCURRENCY=1` for the 1 GiB `t3.micro` instance.
3. Build the three immutable runner images and API:

```bash
docker compose -f docker-compose.ec2.yml --profile runners build
docker compose -f docker-compose.ec2.yml build grader-api
```

4. Before starting Nginx for the first time, request a publicly trusted short-lived
   certificate for the EC2 public IP. Certbot 5.4 or newer supports IP certificates:

```bash
mkdir -p data/letsencrypt data/certbot
docker run --rm -p 80:80 \
  -v "$PWD/data/letsencrypt:/etc/letsencrypt" \
  certbot/certbot:v5.4.0 certonly --standalone \
  --preferred-profile shortlived --ip-address 47.128.81.75 \
  --agree-tos --email YOUR_EMAIL --non-interactive
```

5. Start the API and TLS proxy:

```bash
docker compose -f docker-compose.ec2.yml up -d grader-api nginx
curl https://47.128.81.75/health/ready
```

IP certificates are valid for about six days. Run `deploy/renew-certificate.sh`
daily from a systemd timer or cron and reload Nginx after renewal. Test issuance
with the Let's Encrypt staging environment before requesting the production cert.

The repository includes systemd units for the EC2 layout above:

```bash
sudo cp deploy/learnpython-grader-renew.service /etc/systemd/system/
sudo cp deploy/learnpython-grader-renew.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now learnpython-grader-renew.timer
```

EC2 Security Group rules:

- TCP 443: public, because Render outbound addresses may change.
- TCP 80: public for ACME HTTP validation and HTTPS redirect.
- TCP 22: only from the administrator's current IP, or replace SSH with SSM.
- Do not expose TCP 8080; Compose binds it to EC2 loopback only.

## Render backend configuration

Set these environment variables to switch the four supported languages to the
AWS Docker provider:

```text
SANDBOX_PROVIDER=AWS_DOCKER
AWS_DOCKER_GRADER_URL=https://47.128.81.75
AWS_DOCKER_GRADER_TOKEN=<same random token as GRADER_API_TOKEN on EC2>
```

Redeploy the Render backend after changing the environment. `JUDGE0` remains the
default provider until `SANDBOX_PROVIDER` is explicitly set. SQL intentionally
continues to use Judge0 during this phase.

## API example

```bash
curl https://47.128.81.75/v1/execute \
  -H "Authorization: Bearer $GRADER_API_TOKEN" \
  -H "Content-Type: application/json" \
  -H "X-Request-ID: manual-smoke-001" \
  --data '{"language":"PYTHON","sourceCode":"print(input()[::-1])","inputs":["abc"],"timeoutMs":1000,"memoryKb":65536}'
```

The response contains ordered execution results only. Output comparison and the
final pass/fail grade are calculated by the LearnPython backend.
