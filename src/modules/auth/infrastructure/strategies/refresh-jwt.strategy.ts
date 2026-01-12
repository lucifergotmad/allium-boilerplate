import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { EnvService } from '@shared/infrastructure/config/env.service';
import { JwtPayload } from '@shared/core/interfaces/jwt-payload.interface';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly envService: EnvService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envService.jwtRefreshKey,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload) {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedException('Refresh Token Missing');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
