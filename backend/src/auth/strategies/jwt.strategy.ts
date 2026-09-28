import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import { SessionsService } from '../sessions.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private sessions: SessionsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  // Checar a sessão faz o logout valer na hora, sem esperar o access token expirar
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (
      !payload.sid ||
      !(await this.sessions.isActive(payload.sid, payload.sub))
    ) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
