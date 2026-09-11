/// <reference types="node" />
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node -T prisma/seed/seed.ts"
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
