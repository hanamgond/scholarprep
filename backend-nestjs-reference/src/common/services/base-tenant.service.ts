// backend/src/common/services/base-tenant.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TenantContextService } from './tenant-context.service';
import { BaseEntity } from '../entities/base.entity';

@Injectable()
export abstract class BaseTenantService<T extends BaseEntity> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly tenantContext: TenantContextService,
  ) {}

  protected getTenantId(): string {
    return this.tenantContext.getTenantId();
  }

  async findAll(): Promise<T[]> {
    return this.repository.find({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { tenant_id: this.getTenantId() } as any,
    });
  }

  async findOne(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      where: { id, tenant_id: this.getTenantId() } as any,
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }

    return entity;
  }
}
