import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TenantContextService } from './services/tenant-context.service';
import { TenantGuard } from './guards/tenant.guard';
import { TenantDbInterceptor } from './interceptors/tenant-db.interceptor';

@Global()
@Module({
  imports: [AuthModule],
  providers: [TenantContextService, TenantGuard, TenantDbInterceptor],
  exports: [TenantContextService, TenantGuard, TenantDbInterceptor],
})
export class CommonModule {}
