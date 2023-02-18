import { Controller, Post, UseGuards, Request, Get, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiHeader, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthExample } from 'src/app/docs/example/auth/auth-example';
import { UnauthorizedExample } from 'src/app/docs/example/auth/unauthorized-example';
import { RoleEnum } from 'src/app/enum/role.enum';
import { HttpOperationErrorCodes } from 'src/app/exception/http-operation-error-codes';
import { HttpOperationException } from 'src/app/exception/http-operation.exception';
import { DateFormatter } from 'src/app/util/date.formatter';
import { TokenEntity } from 'src/token/entity/token.entity';
import { AuthService } from './auth.service';
import { AuthResponseDTO } from './dto/response/auth-response.dto';
import { AuthenticatedUserInfoResponseDTO } from './dto/response/authenticated-user-info-response.dto';
import { LogoutResponseDTO } from './dto/response/logout-success-response.dto';
import { ValidateTokenResponseDTO } from './dto/response/validate-token-response.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { Roles } from './roles/require-roles.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiBody({ type: AuthExample })
  @ApiOkResponse({ type: AuthResponseDTO })
  public async auth(@Request() req): Promise<AuthResponseDTO> {
    console.log('auth');
    const token: TokenEntity = await this.authService.getAuthenticatedUserToken(req.user);
    
    return new AuthResponseDTO(
      token.userId,
      token.number,
      DateFormatter.formatDateToStringWithTime(token.expirationDate),
    );
  }

  @Get('authenticated-user-info')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buscar usuário autenticado' })
  @ApiHeader({name: 'Authorization'})
  @ApiOkResponse({ type: AuthenticatedUserInfoResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async getAuthenticatedUserInfo(@Request() req): Promise<AuthenticatedUserInfoResponseDTO> {
    return await this.authService.getAuthenticatedUserInfo(req.user);
  }

  @Post('logout')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Realizar logout' })
  @ApiHeader({name: 'Authorization'})
  @ApiOkResponse({ type: LogoutResponseDTO })
  @ApiUnauthorizedResponse({type: UnauthorizedExample})
  public async logout(@Request() req): Promise<LogoutResponseDTO> {
    const tokenNumber: string = this.validateAndGetTokenFromRequestHeader(req.headers);

    return this.authService.logout(req.user, tokenNumber);
  }

  @Get('validate-token')
  @ApiOperation({ summary: 'Validar e renovar token' })
  @ApiHeader({name: 'Authorization'})
  @ApiOkResponse({ type: ValidateTokenResponseDTO })
  public async validateToken(@Request() req): Promise<ValidateTokenResponseDTO> {
    const tokenNumber: string = this.validateAndGetTokenFromRequestHeader(req.headers);

    return await this.authService.validateTokenNumberAndExtendExpireDateIfExists(tokenNumber);
  }

  private validateAndGetTokenFromRequestHeader(headers: any): string {
    const headerAuthorization: string = headers.authorization;
    
    if (!headerAuthorization) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Token not found on request header', 
        HttpOperationErrorCodes.INVALID_TOKEN_AUTH,
      );
    }

    if (!headerAuthorization.includes('Bearer') || (headerAuthorization.replace('Bearer ', '') === '')) {
      throw new HttpOperationException(
        HttpStatus.BAD_REQUEST, 
        'Token not found on request header', 
        HttpOperationErrorCodes.INVALID_TOKEN_AUTH,
      );
    }

    return headerAuthorization.replace('Bearer ', '');
  }
  
}
