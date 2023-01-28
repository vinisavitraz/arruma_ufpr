import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { RoleEntity } from '../entity/role.entity';
import { AuthenticatedUserEntity } from 'src/user/entity/authenticated-user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

	constructor(private authService: AuthService) {
    	super();
  	}

  	public async validate(email: string, password: string): Promise<AuthenticatedUserEntity> {
      const user: UserEntity = await this.authService.validateLocalStrategyOrCry(email, password);
      const role: RoleEntity = await this.authService.findRoleWithPermissions(user.roleId);

      return new AuthenticatedUserEntity(user, role);
  	}

}