import { Type,  Static } from '@sinclair/typebox'

export enum BiometricTypes {
  TouchId = 'TouchId',
  FaceId =  'FaceId',
  Biometrics = 'Biometrics',
  Webautn = 'Webautn',
}

export enum AuthenticationTypeEnum {
  PHONE_LOCK = 'phonelock',
  MPIN = 'mpin'
}

export enum DeviceTypeEnum {
  ios='ios',
  android='android'
}
export const Passkey = Type.Object({
  customerId: Type.String(),
  publicKey: Type.String(),
  algorithm: Type.String({default: 'RSA'}),
  challengeId: Type.String(), // supertokenid
  deviceId: Type.String(), // device id
  osType: Type.Enum(DeviceTypeEnum),
  biometricType: Type.Enum(BiometricTypes),
  authenticationType: Type.Enum(AuthenticationTypeEnum)
})
export type TPasskey = Static<typeof Passkey>

export const PasskeyChallenge = Type.Object({
  customerId: Type.String(),
  challengeId: Type.String(),
  challenge: Type.String(),
  origin: Type.String(),
  payload: Type.Optional(Type.String()),
  osType: Type.Enum(DeviceTypeEnum),
  authenticationType: Type.Enum(AuthenticationTypeEnum),
  counter: Type.Number()
})

export type TPasskeyChallenge = Static<typeof PasskeyChallenge>

export const AuthPreference = Type.Object({
  osType: Type.String(),
  authenticationType: Type.String()
})

export type TAuthPreference = Static<typeof AuthPreference>

export const UserAuthPreference = Type.Object({
  lastLogin: Type.Object({
    loginTime: Type.String(),
    osType: Type.String(),
    authenticationType: Type.String(),
  }),
  authPreferences: Type.Array(AuthPreference)

})
export type TUserAuthPreference = Static<typeof UserAuthPreference>

export enum MessageEnums {
  SUCCESS = 'SUCCESS',
  CANNOT_CREATE_USER = 'CANNOT_CREATE_USER',
  NO_AUTHENTICATOR_FOR_USER = 'NO_AUTHENTICATOR_FOR_USER',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ERROR_CONNECTING_TO_DB = 'ERROR_CONNECTING_TO_DB'
}