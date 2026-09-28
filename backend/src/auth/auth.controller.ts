import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { CookieOptions, Request, Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AllowNewUsersGuard } from './guards/allow-new-users.guard';
import { CsrfHeaderGuard } from './guards/csrf-header.guard';
import type { JwtPayload } from './interfaces/jwt-payload.interface';

const REFRESH_COOKIE = 'refresh_token';
const SAME_SITE_VALUES = ['strict', 'lax', 'none'] as const;

type AuthResult = Awaited<ReturnType<AuthService['login']>>;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly cookieOptions: CookieOptions;

  constructor(
    private auth: AuthService,
    config: ConfigService,
  ) {
    // Valor inválido faria o res.cookie lançar erro em todo login; melhor
    // falhar na subida da API
    const sameSite = config
      .get<string>('REFRESH_COOKIE_SAMESITE', 'strict')
      .trim()
      .toLowerCase();
    if (!(SAME_SITE_VALUES as readonly string[]).includes(sameSite)) {
      throw new Error(
        `REFRESH_COOKIE_SAMESITE inválido: "${sameSite}" (use ${SAME_SITE_VALUES.join(', ')})`,
      );
    }
    const secure = config.get('NODE_ENV') !== 'development';
    // Navegadores descartam cookie SameSite=None sem Secure
    if (sameSite === 'none' && !secure) {
      throw new Error(
        'REFRESH_COOKIE_SAMESITE=none exige HTTPS (NODE_ENV != development)',
      );
    }

    this.cookieOptions = {
      httpOnly: true,
      secure,
      sameSite: sameSite as (typeof SAME_SITE_VALUES)[number],
      // O cookie só viaja para as rotas de auth, nunca para o resto da API
      path: '/api/auth',
    };
  }

  @Public()
  @UseGuards(AllowNewUsersGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('register')
  @ApiOperation({
    summary: 'Criar conta (somente quando ALLOW_NEW_USERS=true)',
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.respondWithSession(res, await this.auth.register(dto));
  }

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.respondWithSession(res, await this.auth.login(dto));
  }

  @Public()
  @UseGuards(CsrfHeaderGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('refresh')
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiOperation({
    summary: 'Renovar access token (rotaciona o refresh token do cookie)',
  })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      return this.respondWithSession(
        res,
        await this.auth.refresh(this.readRefreshCookie(req)),
      );
    } catch (err) {
      // Só descarta o cookie se a sessão é de fato inválida; falha transitória
      // (ex.: banco fora) não pode deslogar o usuário
      if (err instanceof UnauthorizedException) {
        res.clearCookie(REFRESH_COOKIE, this.cookieOptions);
      }
      throw err;
    }
  }

  @Public()
  @UseGuards(CsrfHeaderGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiCookieAuth(REFRESH_COOKIE)
  @ApiOperation({ summary: 'Encerrar a sessão deste dispositivo' })
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.auth.logout(this.readRefreshCookie(req));
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions);
  }

  @ApiBearerAuth('access-token')
  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Encerrar todas as sessões do usuário em todos os dispositivos',
  })
  async logoutAll(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logoutAll(user.sub);
    res.clearCookie(REFRESH_COOKIE, this.cookieOptions);
  }

  private readRefreshCookie(req: Request): string | undefined {
    const cookies = req.cookies as Record<string, string> | undefined;
    return cookies?.[REFRESH_COOKIE];
  }

  // O refresh token vai só no cookie HttpOnly — nunca no corpo, fora do alcance do JS
  private respondWithSession(res: Response, result: AuthResult) {
    const { refreshToken, refreshTokenExpiresAt, ...body } = result;
    res.cookie(REFRESH_COOKIE, refreshToken, {
      ...this.cookieOptions,
      expires: refreshTokenExpiresAt,
    });
    return body;
  }
}
