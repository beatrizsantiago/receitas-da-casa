import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import type { JwtPayload } from './interfaces/jwt-payload.interface';
import { IssuedRefreshToken, SessionsService } from './sessions.service';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private sessions: SessionsService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.users.findByEmail(dto.email);
    if (existing) throw new ConflictException('E-mail já cadastrado');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.users.create({ ...dto, password: hashed });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const refresh = await this.sessions.create(user.id);
    return this.buildAuthResult(userWithoutPassword, refresh);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('E-mail ou senha inválidos');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('E-mail ou senha inválidos');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    const refresh = await this.sessions.create(user.id);
    return this.buildAuthResult(userWithoutPassword, refresh);
  }

  async refresh(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) throw new UnauthorizedException();

    const refresh = await this.sessions.rotate(rawRefreshToken);
    if (!refresh) throw new UnauthorizedException();

    const user = await this.users.findById(refresh.userId);
    if (!user) throw new UnauthorizedException();

    return this.buildAuthResult(user, refresh);
  }

  async logout(rawRefreshToken: string | undefined) {
    if (rawRefreshToken) await this.sessions.revokeByToken(rawRefreshToken);
  }

  async logoutAll(userId: number) {
    await this.sessions.revokeAllForUser(userId);
  }

  private buildAuthResult<U extends { id: number; email: string }>(
    user: U,
    refresh: IssuedRefreshToken,
  ) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      sid: refresh.sessionId,
    };
    const accessToken = this.jwt.sign(payload, {
      secret: this.config.getOrThrow('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      algorithm: 'HS256',
    });

    return {
      accessToken,
      refreshToken: refresh.refreshToken,
      refreshTokenExpiresAt: refresh.expiresAt,
      user,
    };
  }
}
