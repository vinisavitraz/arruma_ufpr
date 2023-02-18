import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserEntity } from 'src/user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

	constructor(private authService: AuthService) {
    	super();
  	}

  	public async validate(email: string, password: string): Promise<UserEntity> {
      console.log('LocalStrategy');
      return await this.authService.validateLocalStrategyOrCry(email, password);
  	}

}