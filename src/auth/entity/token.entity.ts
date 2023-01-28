import { user_token } from "@prisma/client";

export class TokenEntity {
  
  id: number;
  type: string;
  number: string;
  createDate: Date;
  expirationDate: Date;
  userId: number;
  payload: any;

  constructor(
    id: number,
    type: string,
    number: string, 
    createDate: Date, 
    expirationDate: Date, 
    userId: number,
    payload: any,
  ) {
    this.id = id;
    this.type = type;
    this.number = number;
    this.createDate = createDate;
    this.expirationDate = expirationDate;
    this.userId = userId;
    this.payload = payload;
  }

  public static fromRepository(token: user_token): TokenEntity {
    return new TokenEntity(
      token.id,
      token.type,
      token.token_number,
      token.create_date,
      token.expiration_date,
      token.user_id,
      null,
    );
  }

}