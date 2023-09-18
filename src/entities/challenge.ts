import { User } from './user';
import { Challenge as ChallengeModel } from '@prisma/client';
export class Challenge implements ChallengeModel {
  id: number;
  uid: string;
  challenge: string;
  createdAt: Date;
  origin: string;
  payload: string;
  osType: string;
  counter: number;
  authStatus: boolean;
  authenticationType: string;
  user: User;

  constructor(entity: ChallengeModel) {
    this.id = entity.id;
    this.uid = entity.uid;
    this.challenge = entity.challenge;
    this.createdAt = entity.createdAt;
    this.origin = entity.origin;
    this.payload = entity.payload;
    this.osType = entity.osType;
    this.counter = entity.counter;
    this.authStatus = entity.authStatus;
    this.authenticationType = entity.authenticationType;
    this.user = new User(entity.user);
  }
}