import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function removeQueryParam(url, paramName) {
  const [baseUrl, queryString = ""] = url.split("?");
  const params = new URLSearchParams(queryString);

  params.delete(paramName);

  const nextQueryString = params.toString();
  return nextQueryString ? `${baseUrl}?${nextQueryString}` : baseUrl;
}

export function createPrismaClient(env = process.env) {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to create PrismaClient.");
  }

  const shouldRelaxSsl = env.DATABASE_SSL_REJECT_UNAUTHORIZED === "false";
  const adapterConfig = {
    connectionString: shouldRelaxSsl ? removeQueryParam(env.DATABASE_URL, "sslmode") : env.DATABASE_URL,
  };

  if (shouldRelaxSsl) {
    adapterConfig.ssl = {
      rejectUnauthorized: false,
    };
  }

  const adapter = new PrismaPg({
    ...adapterConfig,
  });

  return new PrismaClient({ adapter });
}
