import { Entity, Column, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Section } from '../../sections/entities/section.entity';

@Entity('classes')
@Unique(['school_id', 'academic_year_id', 'name'])
export class Class extends BaseEntity {
  @Column()
  tenant_id: string;

  @Column()
  school_id: string;

  @Column()
  academic_year_id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ default: 'active' })
  status: string;

  @OneToMany(() => Section, (section) => section.class)
  sections: Section[];
}
