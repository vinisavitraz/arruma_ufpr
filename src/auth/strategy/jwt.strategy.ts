import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/entity/user.entity';
import { AuthenticatedUserEntity } from 'src/user/entity/authenticated-user.entity';
import { RoleEntity } from '../entity/role.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    
    constructor(private authService: AuthService) {
        super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: 'my-secret-key',
        passReqToCallback: true,
        });
    }

    public async validate(req: Request, payload: any): Promise<AuthenticatedUserEntity> {
      const user: UserEntity = await this.authService.validateJWTStrategyOrCry(req, payload);
      const role: RoleEntity = await this.authService.findRoleWithPermissions(user.roleId);

      return new AuthenticatedUserEntity(user, role);
    }

}