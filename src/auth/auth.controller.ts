import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthExample } from 'src/app/docs/example/auth/auth-example';
import { DateFormatter } from 'src/app/util/date.formatter';
import { TokenEntity } from 'src/token/entity/token.entity';
import { AuthService } from './auth.service';
import { AuthResponseDto } from './dto/response/auth-response.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({ type: AuthExample })
  @ApiOkResponse({ type: AuthResponseDto })
  public async auth(@Request() req): Promise<AuthResponseDto> {
    const token: TokenEntity = await this.authService.getAuthenticatedUserToken(req.user);
    
    return new AuthResponseDto(
      token.userId,
      token.number,
      DateFormatter.formatDateToStringWithTime(token.expirationDate),
    );
  }
  
}
