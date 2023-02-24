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
import { ResetUserPasswordRequestDTO } from './dto/request/reset-user-password-request.dto';
import { PasswordRulesValidator } from 'src/app/util/password-rules.validator';
import { validateOrReject } from 'class-validator';
import { InputFieldValidator } from 'src/app/util/input-field.validator';
import { TokenEntity } from 'src/token/entity/token.entity';
import { TokenService } from 'src/token/token.service';
import { UserStatusEnum } from 'src/app/enum/status.enum';
import { RegisterUserRequestDTO } from './dto/request/register-user-request.dto';

@Injectable()
export class UserService {

  private repository: UserRepository;

  constructor(
    private databaseService: DatabaseService,
    private mailService: MailService,
    private tokenService: TokenService,
  ) {
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
    const userDb: user | null = await this.repository.findActiveUserByEmail(email);

    if (!userDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'User with email ' + email + ' not found on database.', 
        HttpOperationErrorCodes.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromRepository(userDb);
  }

  public async findUserByDocumentOrCry(document: string): Promise<UserEntity> {
    const userDb: user | null = await this.repository.findActiveUserByDocument(document);

    if (!userDb) {
      throw new HttpOperationException(
        HttpStatus.NOT_FOUND, 
        'User with document ' + document + ' not found on database.', 
        HttpOperationErrorCodes.USER_NOT_FOUND,
      );
    }

    return UserEntity.fromRepository(userDb);
  }

  public async validateAvailableEmailOrCry(email: string): Promise<void> {
    InputFieldValidator.validateEmail(email);

    const userDb: user | null = await this.repository.findUserByEmail(email);

    if (userDb === null) {
      return;
    }

    if (userDb.status === UserStatusEnum.INACTIVE){
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Blocked email', 
        HttpOperationErrorCodes.BLOCKED_USER_EMAIL,
      );  
    }

    throw new HttpOperationException(
      HttpStatus.BAD_REQUEST, 
      'Email already exists on database', 
      HttpOperationErrorCodes.DUPLICATED_USER_EMAIL,
    );
  }

  public async validateAvailableDocumentOrCry(document: string): Promise<void> {
    InputFieldValidator.validateDocument(document);

    const userDb: user | null = await this.repository.findUserByDocument(document);

    if (userDb === null) {
      return;
    }

    if (userDb.status === UserStatusEnum.INACTIVE){
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Blocked document', 
        HttpOperationErrorCodes.BLOCKED_USER_DOCUMENT,
      );
    }

    throw new HttpOperationException(
      HttpStatus.BAD_REQUEST, 
      'Document already exists on database', 
      HttpOperationErrorCodes.DUPLICATED_USER_DOCUMENT,
    );
  }

  public async createUser(host: string, createUserRequestDTO: CreateUserRequestDTO | RegisterUserRequestDTO): Promise<UserEntity> {
    InputFieldValidator.validateEmail(createUserRequestDTO.email);
    InputFieldValidator.validateDocument(createUserRequestDTO.document);
    InputFieldValidator.validatePhoneNumber(createUserRequestDTO.phone);
    InputFieldValidator.validateName(createUserRequestDTO.name);

    createUserRequestDTO.document = createUserRequestDTO.document.replaceAll('.', '').replaceAll('-', '');
    createUserRequestDTO.phone = createUserRequestDTO.phone.replaceAll('(', '').replaceAll(')', '').replaceAll('-', '');

    await this.validateAvailableEmailOrCry(createUserRequestDTO.email);
    await this.validateAvailableDocumentOrCry(createUserRequestDTO.document);
    
    const generatePassword: boolean = createUserRequestDTO instanceof CreateUserRequestDTO;
    let password: string = '';

    if (generatePassword) {
      password = this.generatePassword();
    } else {
      await validateOrReject(createUserRequestDTO);
      PasswordRulesValidator.validateCreateUser(createUserRequestDTO as RegisterUserRequestDTO);
      password = (createUserRequestDTO as RegisterUserRequestDTO).password;
    }

    const hashedPassword: string = await this.hashPassword(password);
    let user: user | null = null;

    try {
      user = await this.repository.createUser(createUserRequestDTO, hashedPassword);

      if (generatePassword) {
        await this.sendCreateUserPasswordMail(host, user.email);
      }
      
      return UserEntity.fromRepository(user);
    } catch (error) {
      if (user !== null) {
        await this.repository.deleteUser(user);
      }

      throw error;
    }
  }

  public async updateUser(updateUserRequestDTO: UpdateUserRequestDTO): Promise<UserEntity> {
    const userDb: UserEntity = await this.findUserByIDOrCry(updateUserRequestDTO.id);

    InputFieldValidator.validateEmail(updateUserRequestDTO.email);
    InputFieldValidator.validateDocument(updateUserRequestDTO.document);
    InputFieldValidator.validatePhoneNumber(updateUserRequestDTO.phone);
    InputFieldValidator.validateName(updateUserRequestDTO.name);
    

    updateUserRequestDTO.document = updateUserRequestDTO.document.replace('.', '').replace('-', '');
    updateUserRequestDTO.phone = updateUserRequestDTO.phone.replace('(', '').replace(')', '').replace('-', '');

    if (userDb.email !== updateUserRequestDTO.email && await this.repository.findActiveUserByEmail(updateUserRequestDTO.email) !== null) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Email already exists on database', 
        HttpOperationErrorCodes.DUPLICATED_USER_EMAIL,
      );
    }

    if (userDb.document !== updateUserRequestDTO.document && await this.repository.findUserByDocument(updateUserRequestDTO.document) !== null) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Document already exists on database', 
        HttpOperationErrorCodes.DUPLICATED_USER_DOCUMENT,
      );
    }

    const user: user = await this.repository.updateUser(updateUserRequestDTO);

    return UserEntity.fromRepository(user);
  }

  public async deleteUser(userId: number): Promise<void> {
    const user: UserEntity = await this.findUserByIDOrCry(userId);

    await this.repository.inactivateUser(user);
  }

  public async changeUserPassword(changeUserPasswordRequestDTO: ResetUserPasswordRequestDTO): Promise<void> {
    await validateOrReject(changeUserPasswordRequestDTO);

    PasswordRulesValidator.validateChangePassword(changeUserPasswordRequestDTO);

    const user: UserEntity = await this.findUserByIDOrCry(changeUserPasswordRequestDTO.userId);
    const hashedPassword: string = await this.hashPassword(changeUserPasswordRequestDTO.password);

    await this.repository.changeUserPassword(user, hashedPassword);
  }

  public async findTotalUsers(): Promise<number> {
    return await this.repository.findTotalUsers();
  }

  public async sendCreateUserPasswordMail(host: string, email: string): Promise<void> {
    const user = await this.findUserByEmailOrCry(email);
    const token: TokenEntity = await this.tokenService.getNewResetPasswordToken(user);

    await this.mailService.sendCreatePasswordMail(host, token.number, email);
  }

  public async sendResetUserPasswordMail(host: string, email: string): Promise<void> {
    const user = await this.findUserByEmailOrCry(email);
    const token: TokenEntity = await this.tokenService.getNewResetPasswordToken(user);

    await this.mailService.sendResetPasswordMail(host, token.number, email);
  }
  
  public async findUserByResetPasswordToken(tokenNumber: string): Promise<UserEntity> {
    const token: TokenEntity = await this.tokenService.getResetPasswordToken(tokenNumber);

    return await this.findUserByIDOrCry(token.userId);
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
