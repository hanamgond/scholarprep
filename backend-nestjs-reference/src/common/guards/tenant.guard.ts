// backend/src/common/guards/tenant.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TenantContextService } from '../services/tenant-context.service';

interface JwtPayload {
  sub: string;
  email: string;
  tenantId: string;
  campusId?: string;
  role: string;
  permissions: string[];
}

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private tenantContextService: TenantContextService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // Skip authentication for health endpoint (temporary solution)
    if (request.url === '/api/health') {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret:
          process.env.JWT_SECRET ||
          'development-fallback-secret-change-in-production',
      });

      // Set tenant context
      this.tenantContextService.setContext({
        tenantId: payload.tenantId,
        campusId: payload.campusId,
        userId: payload.sub,
        role: payload.role,
        permissions: payload.permissions || [],
      });

      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
