import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";

const [, , envFile = ".env.local", command, ...args] = process.argv;

if (!command) {
  console.error("Usage: node scripts/with-env.mjs <env-file> <command> [...args]");
  process.exit(1);
}

const nextEnv = { ...process.env };

if (existsSync(envFile)) {
  const lines = readFileSync(envFile, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!key || nextEnv[key]) {
      continue;
    }

    nextEnv[key] = value;
  }
}

const child = spawn(command, args, {
  env: nextEnv,
  shell: true,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});
