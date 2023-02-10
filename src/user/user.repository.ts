import { user } from "@prisma/client";
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
      orderBy: [
        {
          id: 'asc',
        },
      ],
    });
  }

  public async findUserByEmail(email: string): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { email: email } });
  }

  public async findUserByID(id: number): Promise<user | null> {
    return await this.connection.user.findUnique({ where: { id: id } })
  }

  public async createUser(createUserRequestDTO: CreateUserRequestDTO, generatedPassword: string): Promise<user | null> {
    return await this.connection.user.create({ 
      data: {
        name: createUserRequestDTO.name,
        email: createUserRequestDTO.email,
        role: createUserRequestDTO.role,
        password: generatedPassword,
      },
    });
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<user | null> {
    return await this.connection.user.update({ 
      where: { id: updateUserRequestDTO.id },
      data: {
        name: updateUserRequestDTO.name,
        email: updateUserRequestDTO.email,
        role: updateUserRequestDTO.role,
      },
    });
  }

  public async deleteUser(user: UserEntity): Promise<void> {
    await this.connection.user.delete({where: { id: user.id }});
  }

  public async findTotalUsers(): Promise<number> {
    return await this.connection.user.count();
  }
  
}