#!/usr/bin/env -S bun run --
import Exa from "exa-js@2.0.12";
import { loadEnv, getEnv } from "../../_shared/secrets.ts";

await loadEnv(import.meta.dir);

const exa = new Exa(getEnv("EXA_API_KEY"));

const query = process.argv[2];
if (!query) {
  console.error("Usage: web-search.ts <query>");
  process.exit(1);
}

const results = await exa.search(query);
console.log(results);
