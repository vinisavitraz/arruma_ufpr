import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { TokenType } from 'src/app/enum/token.enum';
import { TokenService } from 'src/token/token.service';
import { TokenEntity } from 'src/token/entity/token.entity';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {}

  public async getAuthenticatedUserToken(user: UserEntity): Promise<TokenEntity> {
    const tokenDb: TokenEntity | null = await this.tokenService.findTokenByUserAndType(user.id, TokenType.AUTH);
    
    if (tokenDb) {
      return tokenDb;
    }

    return await this.tokenService.buildNewTokenAuth(user);
  }

  public async validateJWTStrategyOrCry(req: Request, payload: any): Promise<UserEntity> {
    const userDb: UserEntity = await this.userService.findUserByEmailOrCry(payload.username);
    const tokenFromRequest: string = req.headers['authorization'].replace('Bearer ', '');

    await this.tokenService.validateUserToken(userDb.id, tokenFromRequest);
    
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

}
