import { HttpStatus, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(private databaseService: DatabaseService, private userService: UserService) {
    //this.repository = new AuthRepository(this.databaseService);
}

  public async validateJWTStrategyOrCry(req: Request, payload: any): Promise<user> {
    const userDb: user = await this.userService.findUserByEmailOrCry(payload.username);
    //const activeToken: token_mib = await this.findUserActiveTokenOrCry(userDb.id, TokenMibType.AUTH);;
    const activeToken: string = '123';
    
    const tokenFromRequest: string = req.headers['authorization'].replace('Bearer ', '');
    
    if (tokenFromRequest !== activeToken) {
        throw new HttpOperationException(
          HttpStatus.UNAUTHORIZED, 
          'Token from header authorization not found!', 
          HttpOperationErrorCodes.INVALID_TOKEN_AUTH
        );
    }

    return userDb;
  }

  public async validateLocalStrategyOrCry(email: string, password: string): Promise<user> {
    const userDb: user = await this.userService.findUserByEmailOrCry(email);
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

}
