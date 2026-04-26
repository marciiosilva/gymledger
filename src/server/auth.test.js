// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { authenticateRequest, extractBearerToken } from "./auth.js";

describe("server auth", () => {
  it("extracts bearer tokens", () => {
    expect(extractBearerToken("Bearer token-123")).toBe("token-123");
    expect(extractBearerToken("bearer token-456")).toBe("token-456");
    expect(extractBearerToken("Basic token-123")).toBe("");
    expect(extractBearerToken()).toBe("");
  });

  it("rejects requests without a token", async () => {
    const authClient = {
      auth: {
        getUser: vi.fn(),
      },
    };

    const result = await authenticateRequest({ authClient });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("missing_token");
    expect(authClient.auth.getUser).not.toHaveBeenCalled();
  });

  it("rejects invalid tokens", async () => {
    const authClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("expired"),
        }),
      },
    };

    const result = await authenticateRequest({
      authClient,
      authorizationHeader: "Bearer expired-token",
    });

    expect(result.ok).toBe(false);
    expect(result.error).toBe("invalid_token");
    expect(authClient.auth.getUser).toHaveBeenCalledWith("expired-token");
  });

  it("returns the authenticated Supabase user", async () => {
    const user = {
      id: "user-1",
      email: "admin@gymledger.local",
      role: "authenticated",
    };
    const authClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user },
          error: null,
        }),
      },
    };

    const result = await authenticateRequest({
      authClient,
      authorizationHeader: "Bearer valid-token",
    });

    expect(result).toEqual({ ok: true, user });
    expect(authClient.auth.getUser).toHaveBeenCalledWith("valid-token");
  });
});
