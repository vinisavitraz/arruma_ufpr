import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthExample } from 'src/app/docs/example/auth/auth-example';
import { DateFormatter } from 'src/app/util/date.formatter';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/response/auth-response.dto';
import { TokenEntity } from './entity/token.entity';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  @ApiBody({ type: AuthExample })
  public async auth(@Request() req): Promise<AuthResponseDto> {
    const token: TokenEntity = await this.authService.auth(req.user.user);

    return new AuthResponseDto(
      token.userId,
      token.number,
      DateFormatter.formatDateToStringWithTime(token.expirationDate),
    );
  }
  
}
