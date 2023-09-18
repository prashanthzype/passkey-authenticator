import { User as UserModel } from "@prisma/client";
import { OAuthUser } from "@jmondi/oauth2-server";

export class User implements UserModel, OAuthUser {
  readonly id: string;
  readonly uid: string;
  readonly createdAt: Date;
  readonly customerId: string
  constructor(entity: UserModel) {
    this.id = entity.id;
    this.uid = entity.uid
    this.createdAt = entity.createdAt
    this.customerId = entity.customerId
  }
}
