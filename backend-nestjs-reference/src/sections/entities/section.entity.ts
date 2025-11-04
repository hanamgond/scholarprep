import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Class } from '../../classes/entities/class.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';

@Entity('sections')
@Unique(['class', 'name'])
export class Section extends BaseEntity {
  @Column()
  name: string;

  @Column()
  tenant_id: string;

  @Column({ nullable: true })
  code?: string;

  @Column({ type: 'int', default: 0 })
  display_order: number;

  @Column({ type: 'int', nullable: true })
  capacity?: number;

  @Column({ default: 'active' })
  status: string;

  @ManyToOne(() => Class, (cls) => cls.sections)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.section)
  enrollments: Enrollment[];
}
