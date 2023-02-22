import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import { user_token } from '@prisma/client';
import { TokenType } from 'src/app/enum/token.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { TokenEntity } from './entity/token.entity';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {

  static AUTH_TOKEN_EXPIRATION_TIME_MINUTES = '43800m';
  static RECOVER_PASSWORD_TOKEN_EXPIRATION_TIME_MINUTES = '10m';

  readonly repository: TokenRepository;

  constructor(
    private databaseService: DatabaseService, 
    private jwtService: JwtService,
  ) {
    this.repository = new TokenRepository(this.databaseService);
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  public async removeExpiredTokens(): Promise<void> {
    const expiredUserTokens: user_token[] = await this.repository.getExpiredUserTokens();
    
    if (expiredUserTokens.length > 0) {
      await this.repository.deleteTokens(expiredUserTokens);
      console.log('Removed expired tokens - User tokens: ' + expiredUserTokens.length);  
    }
  }

  public async findTokenByUserAndType(userId: number, type: TokenType): Promise<TokenEntity | null> {
    const token: user_token | null = await this.repository.findTokenByUserAndType(userId, type);
    
    if (token) {
      return TokenEntity.fromRepository(token);
    }

    return null;    
  }

  public async findTokenByNumberAndType(tokenNumber: string, type: TokenType): Promise<TokenEntity | null> {
    const token: user_token | null = await this.repository.findTokenByNumberAndType(tokenNumber, type);
    
    if (token) {
      return TokenEntity.fromRepository(token);
    }

    return null;    
  }

  public async validateUserToken(userId: number, tokenFromRequest: string): Promise<void> {
    const activeToken: TokenEntity = await this.findUserTokenOrCry(userId, TokenType.AUTH);

    if (tokenFromRequest !== activeToken.number) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Invalid token from header authorization', 
        HttpOperationErrorCodes.INVALID_TOKEN_AUTH
      );
    }
  }

  public async getNewResetPasswordToken(user: UserEntity): Promise<TokenEntity> {
    const activeAuthToken: TokenEntity = await this.findTokenByUserAndType(user.id, TokenType.AUTH);;
    const activeRecoverPasswordToken: TokenEntity = await this.findTokenByUserAndType(user.id, TokenType.RESET_PASSWORD);

    if (activeAuthToken) {
      await this.repository.deleteToken(activeAuthToken.id);
    }

    if (activeRecoverPasswordToken) {
      await this.repository.deleteToken(activeRecoverPasswordToken.id);
    }

    return await this.buildNewTokenRecoverPassword(user);
  }

  public async getResetPasswordToken(tokenNumber: string): Promise<TokenEntity> {
    const activeRecoverPasswordToken: user_token = await this.repository.findTokenByNumberAndType(tokenNumber, TokenType.RESET_PASSWORD);

    if (!activeRecoverPasswordToken) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Token not exists', 
        HttpOperationErrorCodes.TOKEN_NOT_FOUND,
      );
    }

    return TokenEntity.fromRepository(activeRecoverPasswordToken);
  }

  public async deleteToken(token: TokenEntity): Promise<void> {
    await this.repository.deleteToken(token.id);
  }

  public async findUserTokenOrCry(userId: number, type: TokenType): Promise<TokenEntity> {
    const token: user_token = await this.repository.findTokenByUserAndType(userId, type);
    
    if (!token) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'User ' + userId + ' does not have one "' + type + '" token.', 
        HttpOperationErrorCodes.TOKEN_NOT_FOUND,
      );
    }

    return TokenEntity.fromRepository(token);
  }

  public async buildNewTokenAuth(user: UserEntity): Promise<TokenEntity> {
    const payload: object = { username: user.email, sub: user.id };
    const tokenExpirationDate: Date = new Date();
    tokenExpirationDate.setMonth(tokenExpirationDate.getMonth() + 1);
    
    return await this.createAndSaveToken(
      TokenType.AUTH, 
      payload, 
      tokenExpirationDate, 
      user.id, 
      TokenService.AUTH_TOKEN_EXPIRATION_TIME_MINUTES
    );
  }

  public async buildNewTokenRecoverPassword(user: UserEntity): Promise<TokenEntity> {
    const payload: object = { username: user.email, sub: user.id };
    const tokenExpirationDate: Date = new Date();
    tokenExpirationDate.setMinutes(tokenExpirationDate.getMinutes() + 10);
    
    return await this.createAndSaveToken(
      TokenType.RESET_PASSWORD, 
      payload, 
      tokenExpirationDate, 
      user.id, 
      TokenService.RECOVER_PASSWORD_TOKEN_EXPIRATION_TIME_MINUTES
    );
  }

  public async createAndSaveToken(
    type: TokenType,
    payload: object,
    expirationDate: Date,
    userId: number,
    expirationTimeInMinutes: string,
  ): Promise<TokenEntity> {
    const tokenNumber: string = this.jwtService.sign(payload, { expiresIn: expirationTimeInMinutes });
    const token: TokenEntity = new TokenEntity(
      0,
      type, 
      tokenNumber, 
      new Date(), 
      expirationDate,
      userId,
      payload,
    );

    const tokenDb: user_token = await this.repository.saveToken(token);
    
    return TokenEntity.fromRepository(tokenDb);
  }

  public async updateTokenExpireDate(token: TokenEntity, newExpireDate: Date): Promise<TokenEntity> {
    const updatedToken: user_token = await this.repository.updateTokenExpirationDate(token.id, newExpireDate);

    return TokenEntity.fromRepository(updatedToken);
  }
  
}
