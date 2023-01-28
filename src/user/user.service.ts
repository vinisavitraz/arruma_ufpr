import { HttpStatus, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DatabaseService } from 'src/database/database.service';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

  private repository: UserRepository;

  constructor(private databaseService: DatabaseService) {
      this.repository = new UserRepository(this.databaseService);
  }

  public async findUserByIDOrCry(id: number): Promise<UserEntity> {
    const userDb: user | null = await this.repository.findUserByID(id);

    if (!userDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'User with ID ' + id + ' not found on database.', 
        HttpOperationErrorCodes.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromRepository(userDb);
  }

  public async findUserByEmailOrCry(email: string): Promise<UserEntity> {
    const userDb: user | null = await this.repository.findUserByEmail(email);

    if (!userDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'User with email ' + email + ' not found on database.', 
        HttpOperationErrorCodes.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromRepository(userDb);
  }

}
