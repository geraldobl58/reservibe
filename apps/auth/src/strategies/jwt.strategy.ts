import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';

import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    const opts: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) =>
          request?.cookies?.Authentication || request?.Authentication,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    };

    super(opts);
  }

  async validate({ userId }: TokenPayload) {
    return this.userService.getUser({ _id: userId });
  }
}
