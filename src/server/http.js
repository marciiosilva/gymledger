import { createServer } from "node:http";
import { authenticateRequest } from "./auth.js";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, jsonHeaders);
  response.end(JSON.stringify(payload));
}

export function createApiServer({ config, authClient, now = () => new Date() } = {}) {
  const serverConfig = config ?? { env: "development" };

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, {
        status: "ok",
        service: "gymledger-api",
        environment: serverConfig.env,
        timestamp: now().toISOString(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api") {
      sendJson(response, 200, {
        name: "GymLedger API",
        version: "0.1.0",
        modules: ["students", "plans", "finance", "workouts", "exercises", "check-ins"],
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/auth/me") {
      if (!authClient) {
        sendJson(response, 503, {
          error: "auth_unavailable",
          message: "Supabase Auth is not configured.",
        });
        return;
      }

      const result = await authenticateRequest({
        authClient,
        authorizationHeader: request.headers.authorization,
      });

      if (!result.ok) {
        sendJson(response, result.statusCode, {
          error: result.error,
          message: result.message,
        });
        return;
      }

      sendJson(response, 200, {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          appMetadata: result.user.app_metadata ?? {},
        },
      });
      return;
    }

    sendJson(response, 404, {
      error: "not_found",
      message: "Route not found.",
    });
  });
}
