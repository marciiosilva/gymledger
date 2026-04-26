// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createApiServer } from "./http.js";

function request(server, path, options = {}) {
  return new Promise((resolve, reject) => {
    server.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;

      fetch(`http://127.0.0.1:${port}${path}`, options)
        .then(async (response) => {
          const body = await response.json();
          resolve({ response, body });
        })
        .catch(reject)
        .finally(() => server.close());
    });
  });
}

describe("GymLedger API server", () => {
  it("responds to health checks", async () => {
    const fixedDate = new Date("2026-04-26T12:00:00.000Z");
    const server = createApiServer({
      config: { env: "test" },
      now: () => fixedDate,
    });

    const { response, body } = await request(server, "/health");

    expect(response.status).toBe(200);
    expect(body).toEqual({
      status: "ok",
      service: "gymledger-api",
      environment: "test",
      timestamp: fixedDate.toISOString(),
    });
  });

  it("returns api metadata", async () => {
    const server = createApiServer({ config: { env: "test" } });

    const { response, body } = await request(server, "/api");

    expect(response.status).toBe(200);
    expect(body.name).toBe("GymLedger API");
    expect(body.modules).toContain("students");
    expect(body.modules).toContain("finance");
  });

  it("returns the authenticated Supabase user", async () => {
    const authClient = {
      auth: {
        getUser: async (token) => ({
          data: {
            user: {
              id: `user-for-${token}`,
              email: "admin@gymledger.local",
              role: "authenticated",
              app_metadata: { role: "admin" },
            },
          },
          error: null,
        }),
      },
    };
    const server = createApiServer({ config: { env: "test" }, authClient });

    const { response, body } = await request(server, "/auth/me", {
      headers: {
        authorization: "Bearer valid-token",
      },
    });

    expect(response.status).toBe(200);
    expect(body).toEqual({
      user: {
        id: "user-for-valid-token",
        email: "admin@gymledger.local",
        role: "authenticated",
        appMetadata: { role: "admin" },
      },
    });
  });

  it("rejects auth requests without bearer tokens", async () => {
    const server = createApiServer({
      config: { env: "test" },
      authClient: {
        auth: {
          getUser: async () => ({ data: { user: null }, error: null }),
        },
      },
    });

    const { response, body } = await request(server, "/auth/me");

    expect(response.status).toBe(401);
    expect(body.error).toBe("missing_token");
  });

  it("reports when auth is not configured", async () => {
    const server = createApiServer({ config: { env: "test" } });

    const { response, body } = await request(server, "/auth/me", {
      headers: {
        authorization: "Bearer valid-token",
      },
    });

    expect(response.status).toBe(503);
    expect(body.error).toBe("auth_unavailable");
  });

  it("returns not found for unknown routes", async () => {
    const server = createApiServer({ config: { env: "test" } });

    const { response, body } = await request(server, "/missing");

    expect(response.status).toBe(404);
    expect(body.error).toBe("not_found");
  });
});
