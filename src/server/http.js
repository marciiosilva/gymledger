import { createServer } from "node:http";
import { authenticateRequest } from "./auth.js";
import { confirmStudentImport, listImportBatches, listPlans, previewStudentRows } from "./imports.js";
import { confirmExerciseImport, createExercise, listExercises, previewExerciseRows, updateExercise } from "./exercises.js";
import { readJsonBody } from "./readJsonBody.js";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
};

function buildCorsHeaders(request) {
  const requestOrigin = request.headers.origin;

  return {
    "access-control-allow-origin": requestOrigin || "*",
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,authorization",
  };
}

function sendJson(request, response, statusCode, payload) {
  response.writeHead(statusCode, {
    ...jsonHeaders,
    ...buildCorsHeaders(request),
  });
  response.end(JSON.stringify(payload));
}

function getIdFromResourcePath(pathname, resourcePrefix) {
  const prefix = `${resourcePrefix}/`;
  if (!pathname.startsWith(prefix)) return null;
  return pathname.slice(prefix.length) || null;
}

export function createApiServer({ config, authClient, now = () => new Date() } = {}) {
  const serverConfig = config ?? { env: "development" };

  return createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", "http://localhost");

    if (request.method === "OPTIONS") {
      response.writeHead(204, buildCorsHeaders(request));
      response.end();
      return;
    }

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(request, response, 200, {
        status: "ok",
        service: "gymledger-api",
        environment: serverConfig.env,
        timestamp: now().toISOString(),
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/api") {
      sendJson(request, response, 200, {
        name: "GymLedger API",
        version: "0.1.0",
        modules: ["students", "plans", "finance", "workouts", "exercises", "check-ins"],
      });
      return;
    }

    if (request.method === "GET" && url.pathname === "/auth/me") {
      if (!authClient) {
        sendJson(request, response, 503, {
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
        sendJson(request, response, result.statusCode, {
          error: result.error,
          message: result.message,
        });
        return;
      }

      sendJson(request, response, 200, {
        user: {
          id: result.user.id,
          email: result.user.email,
          role: result.user.role,
          appMetadata: result.user.app_metadata ?? {},
        },
      });
      return;
    }

    try {
      if (request.method === "GET" && url.pathname === "/api/plans") {
        const { plans } = await listPlans();
        sendJson(request, response, 200, { plans });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/imports") {
        const type = url.searchParams.get("type") ?? "STUDENTS";
        const { batches } = await listImportBatches({ type });
        sendJson(request, response, 200, { batches });
        return;
      }

      if (request.method === "GET" && url.pathname === "/api/exercises") {
        const result = await listExercises({
          search: url.searchParams.get("search") ?? "",
          muscleGroup: url.searchParams.get("muscleGroup") ?? "",
          status: url.searchParams.get("status") ?? "all",
        });
        sendJson(request, response, 200, result);
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/exercises") {
        const payload = await readJsonBody(request);
        const exercise = await createExercise(payload);
        sendJson(request, response, 201, { exercise });
        return;
      }

      if (request.method === "PATCH" && getIdFromResourcePath(url.pathname, "/api/exercises")) {
        const id = getIdFromResourcePath(url.pathname, "/api/exercises");
        const payload = await readJsonBody(request);
        const exercise = await updateExercise(id, payload);
        sendJson(request, response, 200, { exercise });
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/imports/students/preview") {
        const payload = await readJsonBody(request);
        const { preview } = await previewStudentRows(payload);
        sendJson(request, response, 200, preview);
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/imports/students/confirm") {
        const payload = await readJsonBody(request);
        const { batch, preview } = await confirmStudentImport(payload);
        sendJson(request, response, 200, {
          batch,
          summary: preview.summary,
        });
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/imports/exercises/preview") {
        const payload = await readJsonBody(request);
        const { preview } = await previewExerciseRows(payload);
        sendJson(request, response, 200, preview);
        return;
      }

      if (request.method === "POST" && url.pathname === "/api/imports/exercises/confirm") {
        const payload = await readJsonBody(request);
        const { batch, preview } = await confirmExerciseImport(payload);
        sendJson(request, response, 200, {
          batch,
          summary: preview.summary,
        });
        return;
      }
    } catch (error) {
      sendJson(request, response, error?.statusCode ?? 500, {
        error: error?.statusCode ? "request_error" : "internal_error",
        message: error instanceof Error ? error.message : "Unexpected error.",
        details: error?.details ?? null,
      });
      return;
    }

    sendJson(request, response, 404, {
      error: "not_found",
      message: "Route not found.",
    });
  });
}
