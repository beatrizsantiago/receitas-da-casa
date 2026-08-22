import { CanActivate, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AllowNewUsersGuard implements CanActivate {
  constructor(private config: ConfigService) {}

  canActivate(): boolean {
    if (this.config.get('ALLOW_NEW_USERS') !== 'true') {
      throw new NotFoundException();
    }
    return true;
  }
}
