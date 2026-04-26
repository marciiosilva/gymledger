import { getServerConfig } from "./config.js";
import { createSupabaseAuthClient } from "./auth.js";
import { createApiServer } from "./http.js";
import { loadEnvFile } from "./loadEnvFile.js";
import { getSupabaseConfig, validateSupabaseEnv } from "./supabaseConfig.js";

loadEnvFile(".env.local");

const config = getServerConfig();
const supabaseEnv = validateSupabaseEnv();
const authClient = supabaseEnv.ok ? createSupabaseAuthClient(getSupabaseConfig()) : undefined;
const server = createApiServer({ config, authClient });

server.listen(config.port, () => {
  if (!supabaseEnv.ok) {
    console.warn(`Supabase env missing: ${supabaseEnv.missing.join(", ")}`);
  }

  console.log(`GymLedger API running on http://localhost:${config.port}`);
});
