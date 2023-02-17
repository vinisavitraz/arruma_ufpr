import { HttpStatus, Injectable } from '@nestjs/common';
import { user } from '@prisma/client';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { SearchUsersRequestDTO } from 'src/dashboard/dto/request/search-users-request.dto';
import { DatabaseService } from 'src/database/database.service';
import { MailService } from 'src/mail/mail.service';
import { CreateUserRequestDTO } from './dto/request/create-user-request.dto';
import { UpdateUserRequestDTO } from './dto/request/update-user-request.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { ChangeUserPasswordRequestDTO } from './dto/request/change-user-password-request.dto';
import { PasswordRulesValidator } from 'src/app/util/password-rules.validator';
import { validateOrReject } from 'class-validator';
import { InputFieldValidator } from 'src/app/util/input-field.validator';

@Injectable()
export class UserService {

  private repository: UserRepository;

  constructor(private databaseService: DatabaseService, private mailService: MailService) {
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
    InputFieldValidator.validateEmail(createUserRequestDTO.email);
    InputFieldValidator.validateDocument(createUserRequestDTO.document);
    InputFieldValidator.validatePhoneNumber(createUserRequestDTO.phone);
    InputFieldValidator.validateName(createUserRequestDTO.name);

    createUserRequestDTO.document = createUserRequestDTO.document.replace('.', '').replace('-', '');
    createUserRequestDTO.phone = createUserRequestDTO.phone.replace('(', '').replace(')', '').replace('-', '');

    if (await this.repository.findUserByEmail(createUserRequestDTO.email) !== null) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Email already exists on database', 
        HttpOperationErrorCodes.DUPLICATED_USER_EMAIL,
      );
    }

    if (await this.repository.findUserByDocument(createUserRequestDTO.document) !== null) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Document already exists on database', 
        HttpOperationErrorCodes.DUPLICATED_USER_DOCUMENT,
      );
    }

    const password: string = this.generatePassword();
    const hashedPassword: string = await this.hashPassword(password);

    let user: user | null = null;

    try {
      user = await this.repository.createUser(createUserRequestDTO, hashedPassword);
      await this.mailService.sendNewAccountMail(password, user.email);

      return UserEntity.fromRepository(user);
    } catch (error) {
      if (user !== null) {
        await this.repository.deleteUser(user);
      }

      throw error;
    }
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<UserEntity> {
    await this.findUserByIDOrCry(updateUserRequestDTO.id);

    const userDb: user = await this.repository.updateUser(updateUserRequestDTO);

    return UserEntity.fromRepository(userDb);
  }

  public async deleteUser(userId: number): Promise<void> {
    const user: UserEntity = await this.findUserByIDOrCry(userId);

    await this.repository.inactivateUser(user);
  }

  public async changeUserPassword(changeUserPasswordRequestDTO: ChangeUserPasswordRequestDTO): Promise<void> {
    await validateOrReject(changeUserPasswordRequestDTO);

    PasswordRulesValidator.validate(changeUserPasswordRequestDTO);

    const user: UserEntity = await this.findUserByIDOrCry(changeUserPasswordRequestDTO.userId);
    const hashedPassword: string = await this.hashPassword(changeUserPasswordRequestDTO.password);

    await this.repository.changeUserPassword(user, hashedPassword);
  }

  public async findTotalUsers(): Promise<number> {
    return await this.repository.findTotalUsers();
  }

  private generatePassword(): string {
    const validChars: string = '0123456789abcdefghijklmnopqrstuvwxyz!@#%*ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength: number = 8;
    let password = '';

    for (var i = 0; i <= passwordLength; i++) {
      let randomNumber: number = Math.floor(Math.random() * validChars.length);
      password += validChars.substring(randomNumber, randomNumber +1);
     }

     return password;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt: string = await bcrypt.genSalt();
    
    return await bcrypt.hash(password, salt);
  }

}
