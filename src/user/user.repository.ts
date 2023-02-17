import { user } from "@prisma/client";
import { UserStatusEnum } from "src/app/enum/status.enum";
import { SearchUsersRequestDTO } from "src/dashboard/dto/request/search-users-request.dto";
import { DatabaseService } from "src/database/database.service";
import { CreateUserRequestDTO } from "./dto/request/create-user-request.dto";
import { UpdateUserRequestDTO } from "./dto/request/update-user-request.dto";
import { UserEntity } from "./entity/user.entity";

export class UserRepository {

  private connection: DatabaseService;

  constructor(databaseService: DatabaseService) {
    this.connection = databaseService;
  }

  public async findUsers(): Promise<user[]> {
    return await this.connection.user.findMany({
      where: {
        status: UserStatusEnum.ACTIVE,
      },
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async searchUsers(searchUsersRequestDTO: SearchUsersRequestDTO): Promise<user[]> {
    return await this.connection.user.findMany({
      skip: searchUsersRequestDTO.skip,
      take: searchUsersRequestDTO.maxPerPage,
      where: {
        status: UserStatusEnum.ACTIVE,
        id: searchUsersRequestDTO.userId,
        name: {
          contains: searchUsersRequestDTO.userName,
          mode: 'insensitive',
        },
        email: {
          contains: searchUsersRequestDTO.userEmail,
          mode: 'insensitive',
        },
        role: searchUsersRequestDTO.userRole,
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });
  }

  public async findUserByEmail(email: string): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { email: email } });
  }

  public async findUserByDocument(document: string): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { document: document } });
  }

  public async findUserByID(id: number): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { id: id } })
  }

  public async createUser(createUserRequestDTO: CreateUserRequestDTO, generatedPassword: string): Promise<user | null> {
    return await this.connection.user.create({ 
      data: {
        name: createUserRequestDTO.name,
        document: createUserRequestDTO.document,
        phone: createUserRequestDTO.phone,
        address: createUserRequestDTO.address,
        email: createUserRequestDTO.email,
        role: createUserRequestDTO.role,
        password: generatedPassword,
        status: UserStatusEnum.ACTIVE,
      },
    });
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<user | null> {
    return await this.connection.user.update({ 
      where: { id: updateUserRequestDTO.id },
      data: {
        name: updateUserRequestDTO.name,
        document: updateUserRequestDTO.document,
        phone: updateUserRequestDTO.phone,
        address: updateUserRequestDTO.address,
        email: updateUserRequestDTO.email,
        role: updateUserRequestDTO.role,
      },
    });
  }

  public async inactivateUser(user: UserEntity): Promise<void> {
    await this.connection.user.update({ 
      where: { id: user.id },
      data: {
        status: UserStatusEnum.INACTIVE,
      },
    });
  }
  
  public async deleteUser(user: UserEntity): Promise<void> {
    await this.connection.user.delete({ 
      where: { id: user.id },
    });
  }

  public async changeUserPassword(user: UserEntity, newPassword: string): Promise<void> {
    await this.connection.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
      },
    });
  }

  public async findTotalUsers(): Promise<number> {
    return await this.connection.user.count({where: {status: UserStatusEnum.ACTIVE}});
  }
  
}