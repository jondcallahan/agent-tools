import { join } from "path";

export async function loadEnv(scriptDir: string): Promise<void> {
  const envPath = join(scriptDir, ".env.local");
  const file = Bun.file(envPath);

  if (!(await file.exists())) {
    throw new Error(
      `Missing .env.local in ${scriptDir}\n` +
        `Create it with your API keys. See SKILL.md for required keys.`
    );
  }

  const content = await file.text();
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    process.env[key] = value;
  }
}

export function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
