import NodeRSA from 'node-rsa';
import type {  TPasskeyChallenge } from './schema';
export const validatePublicKey = (publicKey: string, clientChallenge: TPasskeyChallenge): boolean => {
  const payload = clientChallenge.payload || ''
  const signature = clientChallenge.challenge

  const publicKeyBuffer = Buffer.from(publicKey, 'base64')
  const key: NodeRSA = new NodeRSA()
  const format: NodeRSA.Format = 'public-der' as NodeRSA.Format
  const signer = key.importKey(publicKeyBuffer, format)
  const signatureVerified = signer.verify(Buffer.from(payload), signature, 'utf8', 'base64')
  return signatureVerified
}

export const validateMpin = (storedHash: string, clientChallenge: string): boolean => {
  return storedHash === clientChallenge
}