import {
  Entity,
  Column,
  OneToMany,
  Unique,
  BeforeInsert, // 👈 This import is required
} from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Enrollment } from '../../enrollments/entities/enrollment.entity';
import * as bcrypt from 'bcrypt';

export enum StudentGender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ALUMNI = 'alumni',
}

@Entity('students')
@Unique(['admission_no', 'tenant_id'])
export class Student extends BaseEntity {
  @Column()
  tenant_id: string;

  @Column()
  school_id: string;

  @Column({ unique: true })
  admission_no: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  last_name?: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ type: 'enum', enum: StudentGender, nullable: true })
  gender?: StudentGender;

  @Column({ type: 'date', nullable: true })
  dob?: Date;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE })
  status: StudentStatus;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.student)
  enrollments: Enrollment[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
