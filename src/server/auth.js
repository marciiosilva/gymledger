import { createClient } from "@supabase/supabase-js";

export function extractBearerToken(authorizationHeader) {
  if (typeof authorizationHeader !== "string") {
    return "";
  }

  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() ?? "";
}

export function createSupabaseAuthClient(config) {
  if (!config?.supabaseUrl || !config?.supabaseAnonKey) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required to configure auth.");
  }

  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

export async function authenticateRequest({ authClient, authorizationHeader }) {
  const token = extractBearerToken(authorizationHeader);

  if (!token) {
    return {
      ok: false,
      statusCode: 401,
      error: "missing_token",
      message: "Authorization bearer token is required.",
    };
  }

  const { data, error } = await authClient.auth.getUser(token);

  if (error || !data?.user) {
    return {
      ok: false,
      statusCode: 401,
      error: "invalid_token",
      message: "Authorization bearer token is invalid or expired.",
    };
  }

  return {
    ok: true,
    user: data.user,
  };
}
