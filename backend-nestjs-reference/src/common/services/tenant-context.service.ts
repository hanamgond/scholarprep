// backend/src/common/tenant-context.service.ts
import { Injectable, Scope } from '@nestjs/common';

export interface TenantContext {
  tenantId: string;
  campusId?: string;
  userId: string;
  role: string;
  permissions: string[];
}

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  private context: TenantContext;

  setContext(context: TenantContext): void {
    this.context = context;
  }

  getContext(): TenantContext {
    if (!this.context) {
      throw new Error('Tenant context not set. Ensure TenantGuard is applied.');
    }
    return this.context;
  }

  getTenantId(): string {
    return this.getContext().tenantId;
  }

  getCampusId(): string | undefined {
    return this.getContext().campusId;
  }

  getUserId(): string {
    return this.getContext().userId;
  }

  getRole(): string {
    return this.getContext().role;
  }

  hasPermission(permission: string): boolean {
    return this.getContext().permissions.includes(permission);
  }
}
