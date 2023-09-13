import Fastify, { FastifyInstance } from "fastify";
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import supertokens from "supertokens-node";
import cors from "@fastify/cors";
import { errorHandler } from "supertokens-node/framework/fastify";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import Session from "supertokens-node/recipe/session";
require("dotenv").config();
import config from "./config";

// Plugins

import routes from "./routes.js";

let server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

// Create all roles in supertoken
async function getServer() {
  await server.register(config);
  supertokens.init({
    framework: "fastify",
    telemetry: false,
    supertokens: {
      // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
      connectionURI: server.config.CONNECTION_URI,
      // apiKey: <API_KEY(if configured)>,
    },
    appInfo: {
      // learn more about this on https://supertokens.com/docs/session/appinfo
      appName: server.config.APP_NAME,
      apiDomain: server.config.ZYPE_DOMAIN,
      websiteDomain: server.config.WEBSITE_DOMAIN,
    },
    recipeList: [Session.init(), UserMetadata.init()],
  });
  // Plugins
  server.register(cors, {
    origin: "<YOUR_WEBSITE_DOMAIN>",
    allowedHeaders: ["Content-Type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });
  server.setErrorHandler(errorHandler());
  await server.register(routes, {});
  return server;
}

export default getServer;
