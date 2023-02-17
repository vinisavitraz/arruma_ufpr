import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { ChangeUserPasswordRequestDTO } from 'src/user/dto/request/change-user-password-request.dto';
import { CreateUserRequestDTO } from 'src/user/dto/request/create-user-request.dto';
import { UpdateUserRequestDTO } from 'src/user/dto/request/update-user-request.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { UsersPageContent } from '../content/users-page.content';
import { SearchUsersRequestDTO } from '../dto/request/search-users-request.dto';

@Injectable()
export class DashboardUserService {

  constructor(private readonly userService: UserService) {}

  public async findUsers(): Promise<UserEntity[]> {
    return await this.userService.findUsers();
  }

  public async findTotalUsers(): Promise<number> {
    return await this.userService.findTotalUsers();
  }

  public async searchUsers(
    usersPageContent: UsersPageContent,
  ): Promise<UserEntity[]> {
    return await this.userService.searchUsers(SearchUsersRequestDTO.fromPageContent(usersPageContent));
  }
  
  public async findUserByIDOrCry(id: number): Promise<UserEntity> {
    return await this.userService.findUserByIDOrCry(id);
  }

  public async createUser(host: string, createUserRequestDTO: CreateUserRequestDTO): Promise<void> {
    await validateOrReject(createUserRequestDTO);

    await this.userService.createUser(host, createUserRequestDTO); 
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<void> {
    await validateOrReject(updateUserRequestDTO);

    await this.userService.updateUser(updateUserRequestDTO); 
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userService.deleteUser(userId); 
  }

  public async changeUserPassword(changeUserPasswordRequestDTO: ChangeUserPasswordRequestDTO): Promise<void> {
    await this.userService.changeUserPassword(changeUserPasswordRequestDTO); 
  }

}
