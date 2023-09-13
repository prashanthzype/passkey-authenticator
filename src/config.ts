import "dotenv/config";
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { Static, Type } from "@sinclair/typebox";
import Ajv from "ajv";

export enum NodeEnv {
  development = "development",
  test = "test",
  production = "production",
}

const ConfigSchema = Type.Strict(
  Type.Object({
    NODE_ENV: Type.Enum(NodeEnv),
    LOG_LEVEL: Type.String(),
    PORT: Type.Number({ default: 30013}),
    SERVER_HOST: Type.String({ default: 'localhost'}),
    CONNECTION_URI: Type.String(),
    SUPERTOKEN_API_KEY: Type.String(),
    APP_NAME: Type.String(),
    APP_AUTH_BASE_PATH: Type.String(),
    BASE_URL: Type.String({default: "localhost"}),
    WEBSITE_DOMAIN: Type.String(),
    ZYPE_DOMAIN: Type.String(),
  })
);

const ajv = new Ajv({
  allErrors: true,
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allowUnionTypes: true,
});

export type Config = Static<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  const validate = ajv.compile(ConfigSchema);
  const valid = validate(process.env);
  if (!valid) {
    throw new Error(
      ".env file validation failed - " +
        JSON.stringify(validate.errors, null, 2)
    );
  }
  server.decorate("config", process.env);
};

declare module "fastify" {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(configPlugin);