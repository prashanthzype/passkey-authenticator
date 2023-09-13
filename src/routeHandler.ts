import type { FastifyReply } from "fastify";
import type { SessionRequest } from "supertokens-node/framework/fastify";

import {
  MessageEnums,
  TPasskeyChallenge,
  type TPasskey,
  AuthenticationTypeEnum,
  TAuthPreference,
} from "./schema";
import { PrismaClient } from "@prisma/client";
import { validateMpin, validatePublicKey } from "./utils";
const prisma = new PrismaClient();

export const registerNewPasskeyHandler = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  const body = request.body as TPasskey;
  try {
    // 1. check id user exists
    let user = await prisma.user.findUnique({
      where: {
        customerId: body.customerId,
      },
      include: {
        authenticators: true,
      },
    });
    if (!user) {
      // create new user
      await prisma.user.create({
        data: {
          uid: body.challengeId,
          customerId: body.customerId,
          authenticators: {
            create: [
              {
                credentialId: body.deviceId,
                publicKey: body.publicKey,
                algorithm: body.algorithm,
                osType: body.osType,
                authenticationType: body.authenticationType,
              },
            ],
          },
        },
      });
    }
    return reply.status(200).send({ message: MessageEnums.SUCCESS });
  } catch (e) {
    return reply.status(400).send({ message: MessageEnums.CANNOT_CREATE_USER });
  }
  // now setup the authenticator
};
// FIXME: Counter for retries for same osType and challengeId
export const validatePasskeyHandler = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  try {
    const body = request.body as TPasskeyChallenge;
    let authStatus = false;
    const user = await prisma.user.findUnique({
      where: {
        uid: body.challengeId,
      },
      include: {
        authenticators: true,
      },
    });
    if (user) {
      if (user.authenticators.length === 0) {
        return reply
          .status(400)
          .send({ message: MessageEnums.NO_AUTHENTICATOR_FOR_USER });
      }
      const authenticators = user?.authenticators.filter((a) => {
        let isValid = false;
        if (body.authenticationType === AuthenticationTypeEnum.PHONE_LOCK) {
          isValid = validatePublicKey(a.publicKey, body);
        } else if (body.authenticationType === AuthenticationTypeEnum.MPIN) {
          isValid = validateMpin(a.publicKey, body.challenge);
        }
        // check device id and check ostype
        const isSameOsType = body.osType === a.osType;
        return isValid && isSameOsType;
      });
      if (authenticators.length === 0) {
        authStatus = true;
        // create challenge record and then reply
      }
      await prisma.challenge.create({
        data: {
          uid: user.uid,
          challenge: body.challenge,
          origin: body.origin,
          payload: body.payload || "",
          osType: body.osType,
          counter: body.counter,
          authStatus: authStatus,
          authenticationType: body.authenticationType,
        },
      });
      return reply.status(200).send({
        message: MessageEnums.SUCCESS,
        authenticationStatus: authStatus,
      });
    } else {
      return reply.status(400).send({ message: MessageEnums.USER_NOT_FOUND });
    }
  } catch (e) {
    return reply
      .status(400)
      .send({ message: MessageEnums.ERROR_CONNECTING_TO_DB });
  }
};

export const getUserAuthPreferences = async (
  request: SessionRequest,
  reply: FastifyReply
) => {
  try {
    const { customerId } = request.params as { customerId: string };
    if (!customerId) {
      return reply.status(400).send({ message: MessageEnums.USER_NOT_FOUND });
    }
    const user = await prisma.user.findUnique({
      where: {
        uid: customerId,
      },
      include: {
        authenticators: true,
      },
    });
    if (user) {
      const latestChallenge = await prisma.challenge.findMany({
        where: {
          uid: user?.uid,
          authStatus: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      });
      let lastLogin = {};
      if (latestChallenge.length > 0) {
        const lc = latestChallenge[0];
        lastLogin = {
          loginTime: lc && lc.createdAt,
          osType: lc && lc.osType,
          authenticationType: lc && lc.authenticationType,
        };
      }
      const authPreferences: TAuthPreference[] = user.authenticators.map(
        (a) => {
          return {
            osType: a.osType,
            authenticationType: a.authenticationType,
          };
        }
      );
      return reply.status(200).send({
        authPreferences,
        lastLogin,
      });
    } else {
      return reply.status(400).send({ message: MessageEnums.USER_NOT_FOUND });
    }
  } catch (e) {
    return reply
      .send(400)
      .send({ message: MessageEnums.ERROR_CONNECTING_TO_DB });
  }
};
