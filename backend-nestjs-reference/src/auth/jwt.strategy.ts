// backend/src/auth/jwt.strategy.ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';

interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  campusId: string;
  role: string;
  permissions: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    let secretOrKey = process.env.JWT_SECRET;

    if (!secretOrKey) {
      secretOrKey = 'development-fallback-secret-change-in-production';
      console.warn(
        'JWT_SECRET not found in environment, using development fallback',
      );
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretOrKey,
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.sub,
      email: payload.email,
      tenantId: payload.tenantId,
      campusId: payload.campusId,
      role: payload.role,
      permissions: payload.permissions,
    };
  }
}
