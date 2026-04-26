const DEFAULT_PORT = 4000;

export function getServerConfig(env = process.env) {
  const parsedPort = Number.parseInt(env.PORT ?? "", 10);

  return {
    env: env.NODE_ENV || "development",
    port: Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : DEFAULT_PORT,
  };
}
