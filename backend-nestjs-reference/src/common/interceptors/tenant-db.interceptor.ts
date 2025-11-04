import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { TenantContextService } from '../services/tenant-context.service';

@Injectable()
export class TenantDbInterceptor implements NestInterceptor {
  constructor(private readonly tenantContextService: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const tenantId = this.tenantContextService.getTenantId();

      if (tenantId) {
        console.log(
          `[TenantDbInterceptor] Setting tenant context: ${tenantId}`,
        );
      }
    } catch {
      // Tenant context not set (public routes like /api/health)
      // This is normal for public routes, so we just continue
      console.log('[TenantDbInterceptor] No tenant context for public route');
    }

    return next.handle();
  }
}
