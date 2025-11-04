import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Student } from '../../students/entities/student.entity';
import { Section } from '../../sections/entities/section.entity';

@Entity('enrollments')
export class Enrollment extends BaseEntity {
  @Column()
  academic_year_id: string;

  @Column({ nullable: true })
  roll_number: string;

  @Column({ default: 'enrolled' })
  status: string;

  @ManyToOne(() => Student, (student) => student.enrollments, {
    nullable: false,
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Section, (section) => section.enrollments, {
    nullable: false,
  })
  @JoinColumn({ name: 'section_id' })
  section: Section;
}
