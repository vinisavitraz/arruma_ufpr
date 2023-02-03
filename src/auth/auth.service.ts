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

@Injectable()
export class AuthService {

  static AUTH_TOKEN_EXPIRATION_TIME_MINUTES = '43800m';

  readonly repository: AuthRepository;

  constructor(
    private databaseService: DatabaseService, 
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.repository = new AuthRepository(this.databaseService);
  }

  public async auth(user: UserEntity): Promise<TokenEntity> {
    const tokenDb: user_token | null = await this.repository.findTokenByType(user.id, TokenType.AUTH);
    
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

  private async findUserTokenOrCry(userId: number, type: TokenType): Promise<TokenEntity> {
    const token: user_token = await this.repository.findTokenByType(userId, type);
    
    if (!token) {
      throw new HttpOperationException(
        HttpStatus.UNAUTHORIZED, 
        'User ' + userId + ' does not have one "' + type + '" token.', 
        HttpOperationErrorCodes.TOKEN_NOT_FOUND,
      );
    }

    return TokenEntity.fromRepository(token);
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
