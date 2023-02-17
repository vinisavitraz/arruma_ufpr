import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UserModule } from 'src/user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { SessionSerializer } from './session/session.serializer';
import { TokenModule } from 'src/token/token.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TokenModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    LocalStrategy, 
    JwtStrategy, 
    SessionSerializer
  ],
  exports: [AuthService],
})
export class AuthModule {}
