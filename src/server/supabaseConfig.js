const REQUIRED_SUPABASE_ENV = [
  "DATABASE_URL",
  "DIRECT_URL",
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];

function isBlank(value) {
  return typeof value !== "string" || value.trim().length === 0;
}

export function getSupabaseConfig(env = process.env) {
  return {
    databaseUrl: env.DATABASE_URL ?? "",
    directUrl: env.DIRECT_URL ?? "",
    supabaseUrl: env.SUPABASE_URL ?? "",
    supabaseAnonKey: env.SUPABASE_ANON_KEY ?? "",
    supabaseServiceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  };
}

export function validateSupabaseEnv(env = process.env) {
  const missing = REQUIRED_SUPABASE_ENV.filter((key) => isBlank(env[key]));

  return {
    ok: missing.length === 0,
    missing,
  };
}

