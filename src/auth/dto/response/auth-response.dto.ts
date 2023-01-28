export class AuthResponseDto {

    readonly user_id: number;
    readonly token: string;
    readonly token_expiration_date: string;
    
    constructor(
      userId: number,
      token: string,
      tokenExpirationDate: string,
    ) {
      this.user_id = userId;
      this.token = token;
      this.token_expiration_date = tokenExpirationDate;
    }
    
}