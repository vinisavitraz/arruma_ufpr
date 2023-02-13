import { HttpStatus, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { SearchUsersRequestDTO } from 'src/dashboard/dto/request/search-users-request.dto';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserRequestDTO } from './dto/request/create-user-request.dto';
import { UpdateUserRequestDTO } from './dto/request/update-user-request.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {

  private repository: UserRepository;

  constructor(private databaseService: DatabaseService) {
      this.repository = new UserRepository(this.databaseService);
  }

  public async findUsers(): Promise<UserEntity[]> {
    const usersDb: user[] = await this.repository.findUsers();

    return usersDb.map((user: user) => {
      return UserEntity.fromRepository(user);
    });
  }

  public async searchUsers(searchUsersRequestDTO: SearchUsersRequestDTO): Promise<UserEntity[]> {    
    const usersDb: user[] = await this.repository.searchUsers(
      searchUsersRequestDTO
    );

    return usersDb.map((user: user) => {
      return UserEntity.fromRepository(user);
    });
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

  public async createUser(createUserRequestDTO: CreateUserRequestDTO): Promise<UserEntity> {
    const password: string = '';
    const userDb: user = await this.repository.createUser(createUserRequestDTO, password);

    return UserEntity.fromRepository(userDb);
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<UserEntity> {
    await this.findUserByIDOrCry(updateUserRequestDTO.id);

    const userDb: user = await this.repository.updateUser(updateUserRequestDTO);

    return UserEntity.fromRepository(userDb);
  }

  public async deleteUser(userId: number): Promise<void> {
    const user: UserEntity = await this.findUserByIDOrCry(userId);

    await this.repository.deleteUser(user);
  }

  public async findTotalUsers(): Promise<number> {
    return await this.repository.findTotalUsers();
  }

}
