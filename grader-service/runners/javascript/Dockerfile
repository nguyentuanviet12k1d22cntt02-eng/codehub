FROM node:20-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --uid 10001 --no-create-home --shell /usr/sbin/nologin runner
COPY runners/common/runner.py /opt/grader/runner.py
RUN chmod 0555 /opt/grader/runner.py

USER 10001:10001
WORKDIR /work

ENTRYPOINT ["python3", "/opt/grader/runner.py"]
