// @vitest-environment node
import { describe, expect, it } from "vitest";
import { getSupabaseConfig, validateSupabaseEnv } from "./supabaseConfig.js";

describe("supabase config", () => {
  it("maps environment variables into config", () => {
    const config = getSupabaseConfig({
      DATABASE_URL: "postgres://runtime",
      DIRECT_URL: "postgres://direct",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    });

    expect(config).toEqual({
      databaseUrl: "postgres://runtime",
      directUrl: "postgres://direct",
      supabaseUrl: "https://example.supabase.co",
      supabaseAnonKey: "anon-key",
      supabaseServiceRoleKey: "service-role-key",
    });
  });

  it("reports missing required variables", () => {
    const result = validateSupabaseEnv({
      DATABASE_URL: "postgres://runtime",
      DIRECT_URL: "",
      SUPABASE_URL: "https://example.supabase.co",
    });

    expect(result.ok).toBe(false);
    expect(result.missing).toEqual([
      "DIRECT_URL",
      "SUPABASE_ANON_KEY",
      "SUPABASE_SERVICE_ROLE_KEY",
    ]);
  });

  it("passes when all required variables are present", () => {
    const result = validateSupabaseEnv({
      DATABASE_URL: "postgres://runtime",
      DIRECT_URL: "postgres://direct",
      SUPABASE_URL: "https://example.supabase.co",
      SUPABASE_ANON_KEY: "anon-key",
      SUPABASE_SERVICE_ROLE_KEY: "service-role-key",
    });

    expect(result).toEqual({ ok: true, missing: [] });
  });
});

