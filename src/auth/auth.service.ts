import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthRepository } from './auth.repository';
import { user_token } from '@prisma/client';
import { TokenType } from 'src/app/enum/token.enum';
import { TokenEntity } from './entity/token.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {

  static AUTH_TOKEN_EXPIRATION_TIME_MINUTES = '43800m';
  static RECOVER_PASSWORD_TOKEN_EXPIRATION_TIME_MINUTES = '10m';

  readonly repository: AuthRepository;

  constructor(
    private databaseService: DatabaseService, 
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {
    this.repository = new AuthRepository(this.databaseService);
  }

  @Cron(CronExpression.EVERY_HOUR)
  public async removeExpiredTokens(): Promise<void> {
    const expiredUserTokens: user_token[] = await this.repository.getExpiredUserTokens();
    
    if (expiredUserTokens.length > 0) {
      await this.repository.deleteTokens(expiredUserTokens);
      console.log('Removed expired tokens - User tokens: ' + expiredUserTokens.length);  
    }
  }

  public async auth(user: UserEntity): Promise<TokenEntity> {
    const tokenDb: user_token | null = await this.repository.findTokenByUserAndType(user.id, TokenType.AUTH);
    
    if (tokenDb) {
      return TokenEntity.fromRepository(tokenDb);
    }

    return await this.buildNewTokenAuth(user);
  }

  public async validateJWTStrategyOrCry(req: Request, payload: any): Promise<UserEntity> {
    const userDb: UserEntity = await this.userService.findUserByEmailOrCry(payload.username);
    const activeToken: TokenEntity = await this.findUserTokenOrCry(userDb.id, TokenType.AUTH);;
    const tokenFromRequest: string = req.headers['authorization'].replace('Bearer ', '');
    
    if (tokenFromRequest !== activeToken.number) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Invalid token from header authorization', 
        HttpOperationErrorCodes.INVALID_TOKEN_AUTH
      );
    }

    return userDb;
  }

  public async validateLocalStrategyOrCry(email: string, password: string): Promise<UserEntity> {
    const userDb: UserEntity = await this.userService.findUserByEmailOrCry(email);
    const passwordMatch: boolean = await bcrypt.compare(password, userDb.password);

    if (!passwordMatch) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Wrong password!', 
        HttpOperationErrorCodes.WRONG_PASSWORD,
      );
    }
    
    return userDb;
  }

  public async requestForgotPasswordLink(host: string, email: string): Promise<void> {
    const user = await this.userService.findUserByEmailOrCry(email);
    const activeAuthToken: TokenEntity = await this.findTokenByUserAndType(user.id, TokenType.AUTH);;
    const activeRecoverPasswordToken: TokenEntity = await this.findTokenByUserAndType(user.id, TokenType.RECOVER_PASSWORD);

    if (activeAuthToken) {
      await this.repository.deleteToken(activeAuthToken.id);
    }

    if (activeRecoverPasswordToken) {
      await this.repository.deleteToken(activeRecoverPasswordToken.id);
    }

    const token: TokenEntity = await this.buildNewTokenRecoverPassword(user);

    await this.mailService.sendResetPasswordMail(host, token.number, email);
  }
  
  public async findUserByRecoverPasswordToken(tokenNumber: string): Promise<UserEntity> {
    const activeRecoverPasswordToken: user_token = await this.repository.findTokenByNumberAndType(tokenNumber, TokenType.RECOVER_PASSWORD);

    if (!activeRecoverPasswordToken) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Token not exists', 
        HttpOperationErrorCodes.TOKEN_NOT_FOUND,
      );
    }

    if (tokenNumber !== activeRecoverPasswordToken.token_number) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'Token provided is not the active token', 
        HttpOperationErrorCodes.TOKEN_NOT_MATCH,
      );
    }

    await this.repository.deleteToken(activeRecoverPasswordToken.id);

    return await this.userService.findUserByIDOrCry(activeRecoverPasswordToken.user_id);
  }

  private async findUserTokenOrCry(userId: number, type: TokenType): Promise<TokenEntity> {
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

  private async findTokenByUserAndType(userId: number, type: TokenType): Promise<TokenEntity | null> {
    const token: user_token | null = await this.repository.findTokenByUserAndType(userId, type);
    
    if (token) {
      return TokenEntity.fromRepository(token);
    }

    return null;    
  }

  private async findTokenByNumberAndType(tokenNumber: string, type: TokenType): Promise<TokenEntity | null> {
    const token: user_token | null = await this.repository.findTokenByNumberAndType(tokenNumber, type);
    
    if (token) {
      return TokenEntity.fromRepository(token);
    }

    return null;    
  }

  private async buildNewTokenAuth(user: UserEntity): Promise<TokenEntity> {
    const payload: object = { username: user.email, sub: user.id };
    const tokenExpirationDate: Date = new Date();
    tokenExpirationDate.setMonth(tokenExpirationDate.getMonth() + 1);
    
    return await this.createAndSaveToken(
      TokenType.AUTH, 
      payload, 
      tokenExpirationDate, 
      user.id, 
      AuthService.AUTH_TOKEN_EXPIRATION_TIME_MINUTES
    );
  }

  private async buildNewTokenRecoverPassword(user: UserEntity): Promise<TokenEntity> {
    const payload: object = { username: user.email, sub: user.id };
    const tokenExpirationDate: Date = new Date();
    tokenExpirationDate.setMinutes(tokenExpirationDate.getMinutes() + 10);
    
    return await this.createAndSaveToken(
      TokenType.RECOVER_PASSWORD, 
      payload, 
      tokenExpirationDate, 
      user.id, 
      AuthService.RECOVER_PASSWORD_TOKEN_EXPIRATION_TIME_MINUTES
    );
  }

  private async createAndSaveToken(
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

}
