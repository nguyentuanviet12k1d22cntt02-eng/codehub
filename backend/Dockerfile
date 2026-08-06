# STAGE 1

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./  

COPY src/prisma ./src/prisma/

RUN npm ci

RUN npx prisma generate --schema ./src/prisma/schema.prisma

COPY . .

RUN npx tsc 

# remove devDependencies Stage 1
RUN npm prune --production


# STAGE 2

FROM node:20-alpine AS runner

WORKDIR /app



COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]








