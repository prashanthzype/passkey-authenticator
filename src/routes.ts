import { Type } from '@sinclair/typebox';
import type { FastifyPluginAsync, FastifyInstance, HTTPMethods } from 'fastify';
import { registerNewPasskeyHandler, validatePasskeyHandler, getUserAuthPreferences} from './routeHandler'
import {Passkey, PasskeyChallenge, UserAuthPreference} from './schema';
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";
const routeConfig = [
  {
    method: 'POST' as HTTPMethods,
    url: '/register-passkey',
    body: Passkey,
    schema: {
      200: Type.Object({
        message: Type.String()
      }),
      400: Type.Object({
        message: Type.String()
      })
    },
    preHandler: verifySession(),
    handler: registerNewPasskeyHandler,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/validate-passkey',
    schema: {
      body: PasskeyChallenge,
      response: {
        200: Type.Object({
          validationStatus: Type.Boolean()
        }),
      }
    },
    preHandler: verifySession(),
    handler: validatePasskeyHandler,
  },
  {
    method: 'GET' as HTTPMethods,
    url: '/get-authpreference/:customerId',
    schema: {
      params: Type.String(),
      response: {
        200: UserAuthPreference,
        400: Type.Object({
          message: Type.String()
        })
      }
    },
    preHandler: verifySession(),
    handler: getUserAuthPreferences
  }
]

const routes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  routeConfig.map(route => {
    fastify.route(route)
  })
}

export default routes