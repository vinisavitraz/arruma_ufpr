import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UserEntity } from 'src/user/entity/user.entity';
import { TokenType } from 'src/app/enum/token.enum';
import { TokenService } from 'src/token/token.service';
import { TokenEntity } from 'src/token/entity/token.entity';
import { AuthenticatedUserInfoResponseDTO } from './dto/response/authenticated-user-info-response.dto';
import { user } from '@prisma/client';
import { LogoutResponseDTO } from './dto/response/logout-success-response.dto';
import { ValidateTokenResponseDTO } from './dto/response/validate-token-response.dto';
import { DateFormatter } from 'src/app/util/date.formatter';

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

  public async getAuthenticatedUserInfo(user: user): Promise<AuthenticatedUserInfoResponseDTO> {
    return AuthenticatedUserInfoResponseDTO.fromEntity(user);
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
        HttpStatus.FORBIDDEN, 
        'Wrong password!', 
        HttpOperationErrorCodes.WRONG_PASSWORD,
      );
    }
    
    return userDb;
  }

  public async logout(user: user, tokenNumber: string): Promise<LogoutResponseDTO> {
    const tokenDb: TokenEntity | null = await this.tokenService.findTokenByUserAndType(user.id, TokenType.AUTH);
    
    if (!tokenDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Token not found on database', 
        HttpOperationErrorCodes.TOKEN_NOT_FOUND,
      );
    }
    
    if (tokenNumber !== tokenDb.number) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Token provided is not the active token', 
        HttpOperationErrorCodes.TOKEN_NOT_MATCH,
      );
    }
    
    await this.tokenService.deleteToken(tokenDb);
    
    return new LogoutResponseDTO('User session finished!');
  }

  public async validateTokenNumberAndExtendExpireDateIfExists(tokenNumber: string): Promise<ValidateTokenResponseDTO> {
    const tokenDb: TokenEntity | null = await this.tokenService.findTokenByNumberAndType(tokenNumber, TokenType.AUTH);

    if (!tokenDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'Token not found on database', 
        HttpOperationErrorCodes.TOKEN_NOT_FOUND,
      );
    }

    const expirationDate: Date = tokenDb.expirationDate;
    expirationDate.setDate(expirationDate.getDate() + 1);
    
    await this.tokenService.updateTokenExpireDate(tokenDb, expirationDate);

    return new ValidateTokenResponseDTO(true, DateFormatter.formatDateToStringWithTime(expirationDate),);
  }

}
