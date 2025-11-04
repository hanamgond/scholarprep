// backend/src/campuses/entities/campus.entity.ts
import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('campuses')
export class Campus extends BaseEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @ManyToOne(() => Tenant, { onDelete: 'CASCADE' })
  tenant: Tenant;

  @Column()
  tenant_id: string;

  @Column({ default: true })
  is_active: boolean;
}
