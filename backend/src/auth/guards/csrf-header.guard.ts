import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

export const CSRF_HEADER = 'x-requested-with';

/**
 * Defesa em profundidade para rotas autenticadas por cookie: um header
 * customizado força preflight de CORS, então outra origem não consegue enviá-lo.
 * Complementa o SameSite do cookie de refresh.
 */
@Injectable()
export class CsrfHeaderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!request.headers[CSRF_HEADER]) throw new ForbiddenException();
    return true;
  }
}
