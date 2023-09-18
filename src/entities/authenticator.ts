import { User } from './user';
import { Authenticator as AuthenticatorModel } from "@prisma/client";

export class Authenticator implements AuthenticatorModel {
  id: number;
  uid: string;
  createdAt: Date;
  credentialId: string;
  algorithm: string;
  publicKey: string;
  osType: string;
  user: User;
  authenticationType: string;

  constructor(entity: AuthenticatorModel) {
    this.id = entity.id;
    this.uid = entity.uid;
    this.createdAt = entity.createdAt;
    this.credentialId = entity.credentialId;
    this.algorithm = entity.algorithm;
    this.publicKey = entity.publicKey;
    this.osType = entity.osType;
    this.user = new User(entity.user);
    this.authenticationType = entity.authenticationType;
  }
}