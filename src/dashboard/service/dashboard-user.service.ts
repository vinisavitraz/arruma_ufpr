import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { CreateUserRequestDTO } from 'src/user/dto/request/create-user-request.dto';
import { UpdateUserRequestDTO } from 'src/user/dto/request/update-user-request.dto';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class DashboardUserService {

  constructor(private readonly userService: UserService) {}

  public async findUsers(): Promise<UserEntity[]> {
    return await this.userService.findUsers();
  }

  public async findUserByIDOrCry(id: number): Promise<UserEntity> {
    return await this.userService.findUserByIDOrCry(id);
  }

  public async createUser(createUserRequestDTO: CreateUserRequestDTO): Promise<void> {
    await validateOrReject(createUserRequestDTO);

    await this.userService.createUser(createUserRequestDTO); 
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<void> {
    await validateOrReject(updateUserRequestDTO);

    await this.userService.updateUser(updateUserRequestDTO); 
  }

  public async deleteUser(userId: number): Promise<void> {
    await this.userService.deleteUser(userId); 
  }

}
