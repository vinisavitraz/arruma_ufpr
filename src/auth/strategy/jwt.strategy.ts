import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { user } from '@prisma/client';

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

    public async validate(req: Request, payload: any): Promise<user> {
      return await this.authService.validateJWTStrategyOrCry(req, payload);
    }

}