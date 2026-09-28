import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const DAY_MS = 24 * 60 * 60 * 1000;

// Janela em que reapresentar um refresh token recém-usado é tratado como
// corrida benigna (resposta perdida na rede) em vez de roubo. Fora dela, reuso
// revoga a sessão inteira. É curta de propósito: dentro dela a sessão ganha um
// segundo token válido, e as abas já são serializadas no front (Web Locks).
const REUSE_GRACE_MS = 10 * 1000;

export interface IssuedRefreshToken {
  userId: number;
  sessionId: string;
  refreshToken: string;
  expiresAt: Date;
}

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  private readonly refreshTtlMs: number;
  private readonly sessionMaxAgeMs: number;

  constructor(
    private prisma: PrismaService,
    config: ConfigService,
  ) {
    this.refreshTtlMs =
      Number(config.get('REFRESH_TOKEN_TTL_DAYS', 30)) * DAY_MS;
    this.sessionMaxAgeMs =
      Number(config.get('SESSION_MAX_AGE_DAYS', 90)) * DAY_MS;
  }

  async create(userId: number): Promise<IssuedRefreshToken> {
    const now = new Date();

    // Limpeza oportunista das sessões mortas do usuário
    await this.prisma.session.deleteMany({
      where: {
        userId,
        OR: [{ expiresAt: { lte: now } }, { revokedAt: { not: null } }],
      },
    });

    const sessionExpiresAt = new Date(now.getTime() + this.sessionMaxAgeMs);
    const { raw, hash, expiresAt } = this.generate(now, sessionExpiresAt);

    const session = await this.prisma.session.create({
      data: {
        userId,
        expiresAt: sessionExpiresAt,
        refreshTokens: { create: { tokenHash: hash, expiresAt } },
      },
    });

    return { userId, sessionId: session.id, refreshToken: raw, expiresAt };
  }

  /**
   * Troca um refresh token por um novo (rotação). Retorna null se o token for
   * inválido, expirado, de sessão revogada ou se for detectado reuso.
   */
  async rotate(rawToken: string): Promise<IssuedRefreshToken | null> {
    const now = new Date();
    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(rawToken) },
      include: { session: true },
    });
    if (!token) return null;

    const { session } = token;
    if (
      session.revokedAt ||
      session.expiresAt <= now ||
      token.expiresAt <= now
    ) {
      return null;
    }

    // Marca como usado de forma atômica: só uma requisição concorrente vence
    const claimed = await this.prisma.refreshToken.updateMany({
      where: { id: token.id, usedAt: null },
      data: { usedAt: now },
    });

    if (claimed.count === 0) {
      const current = await this.prisma.refreshToken.findUnique({
        where: { id: token.id },
        select: { usedAt: true },
      });
      const usedAt = current?.usedAt ?? now;
      if (now.getTime() - usedAt.getTime() > REUSE_GRACE_MS) {
        this.logger.warn(
          `Reuso de refresh token detectado (sessão ${session.id}, usuário ${session.userId}); sessão revogada`,
        );
        await this.revoke(session.id);
        return null;
      }
    }

    const { raw, hash, expiresAt } = this.generate(now, session.expiresAt);
    await this.prisma.$transaction([
      this.prisma.refreshToken.create({
        data: { sessionId: session.id, tokenHash: hash, expiresAt },
      }),
      this.prisma.session.update({
        where: { id: session.id },
        data: { lastUsedAt: now },
      }),
      // Tokens expirados não servem nem para detectar reuso
      this.prisma.refreshToken.deleteMany({
        where: { sessionId: session.id, expiresAt: { lte: now } },
      }),
    ]);

    return {
      userId: session.userId,
      sessionId: session.id,
      refreshToken: raw,
      expiresAt,
    };
  }

  /** Revoga a sessão dona do token, esteja ele usado ou não. */
  async revokeByToken(rawToken: string) {
    const token = await this.prisma.refreshToken.findUnique({
      where: { tokenHash: this.hash(rawToken) },
      select: { sessionId: true },
    });
    if (token) await this.revoke(token.sessionId);
  }

  async revoke(sessionId: string) {
    await this.prisma.session.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: number) {
    await this.prisma.session.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async isActive(sessionId: string, userId: number): Promise<boolean> {
    const session = await this.prisma.session.findFirst({
      where: {
        id: sessionId,
        userId,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true },
    });
    return !!session;
  }

  private generate(now: Date, sessionExpiresAt: Date) {
    const raw = randomBytes(32).toString('base64url');
    const expiresAt = new Date(
      Math.min(now.getTime() + this.refreshTtlMs, sessionExpiresAt.getTime()),
    );
    return { raw, hash: this.hash(raw), expiresAt };
  }

  private hash(raw: string) {
    return createHash('sha256').update(raw).digest('hex');
  }
}
