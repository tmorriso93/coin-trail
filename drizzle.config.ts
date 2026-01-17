import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { dot } from 'node:test/reporters';

dotenv.config({
    path: ".env.local",
});

export default defineConfig({
  out: './drizzle',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});