# STAGE 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./  
COPY src/prisma ./src/prisma/

RUN npm ci
RUN npx prisma generate --schema ./src/prisma/schema.prisma

COPY . .
RUN npx tsc 

# Remove devDependencies
RUN npm prune --production

# STAGE 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

# Cài đặt docker-cli, python3 và sqlite3 để phục vụ sandbox chấm bài
RUN apk add --no-cache docker-cli python3 py3-pip sqlite

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/services/sql_runner.py ./dist/services/sql_runner.py

EXPOSE 3000

CMD ["node", "dist/app.js"]








