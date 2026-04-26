// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadEnvFile } from "./loadEnvFile.js";

describe("loadEnvFile", () => {
  it("loads key value pairs without overwriting existing values", () => {
    const dir = mkdtempSync(join(tmpdir(), "gymledger-env-"));
    const path = join(dir, ".env.local");
    const env = { EXISTING: "already-set" };

    writeFileSync(
      path,
      [
        "# comment",
        "DATABASE_URL=postgres://runtime",
        "DIRECT_URL='postgres://direct'",
        'SUPABASE_URL="https://example.supabase.co"',
        "EXISTING=from-file",
      ].join("\n"),
    );

    const result = loadEnvFile(path, env);

    expect(result).toEqual({ loaded: true, path });
    expect(env).toEqual({
      EXISTING: "already-set",
      DATABASE_URL: "postgres://runtime",
      DIRECT_URL: "postgres://direct",
      SUPABASE_URL: "https://example.supabase.co",
    });

    rmSync(dir, { recursive: true, force: true });
  });

  it("reports when the env file does not exist", () => {
    const result = loadEnvFile("missing.env", {});

    expect(result).toEqual({ loaded: false, path: "missing.env" });
  });
});
