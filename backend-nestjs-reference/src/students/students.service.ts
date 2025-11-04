// backend/src/students/students.service.ts
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { DataSource, Like, MoreThan, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Section } from '../sections/entities/section.entity';
import { Student, StudentGender } from './entities/student.entity';
import { TenantContextService } from '../common/services/tenant-context.service'; // ✅ ADD THIS IMPORT

interface GenderCount {
  gender: string;
  count: string;
}

interface CsvRow {
  [key: string]: string;
}

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
    private readonly dataSource: DataSource,
    private readonly tenantContext: TenantContextService, // ✅ ADD THIS
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { section_id, academic_year_id, school_id, ...studentData } =
        createStudentDto;

      const section = await queryRunner.manager.findOneBy(Section, {
        id: section_id,
      });
      if (!section) {
        throw new NotFoundException(
          `Section with ID "${section_id}" not found`,
        );
      }

      const year = new Date().getFullYear();
      const studentCountInYear = await queryRunner.manager.count(Student, {
        where: {
          admission_no: Like(`GKL${year}%`),
          tenant_id: this.tenantContext.getTenantId(), // ✅ ADD TENANT FILTER
        },
      });
      const admission_no = `GKL${year}${(studentCountInYear + 1)
        .toString()
        .padStart(4, '0')}`;

      const sectionStudentCount = await queryRunner.manager.count(Enrollment, {
        where: { section: { id: section_id }, academic_year_id },
      });
      const roll_number = (sectionStudentCount + 1).toString();

      // ✅ FIXED: Use actual tenant_id from context instead of school_id
      const studentEntityData: Partial<Student> = {
        ...studentData,
        dob: studentData.dob ? new Date(studentData.dob) : undefined,
        tenant_id: this.tenantContext.getTenantId(), // ✅ USE ACTUAL TENANT ID
        campus_id: school_id, // Still temporary - we'll fix this later
        admission_no,
      };

      const student = new Student();
      Object.assign(student, studentEntityData);
      const newStudent = await queryRunner.manager.save(student);

      const enrollment = new Enrollment();
      enrollment.student = newStudent;
      enrollment.section = section;
      enrollment.academic_year_id = academic_year_id;
      enrollment.roll_number = roll_number;

      await queryRunner.manager.save(enrollment);
      await queryRunner.commitTransaction();
      return newStudent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      throw new InternalServerErrorException(
        'An error occurred while creating the student.',
        errorMessage,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async bulkCreate(
    file: Express.Multer.File,
    body: {
      section_id: string;
      academic_year_id: string;
      school_id: string;
      tenant_id: string;
    },
  ): Promise<Student[]> {
    if (!file || !file.buffer) {
      throw new BadRequestException('The uploaded file is empty.');
    }

    const studentsToCreate: CreateStudentDto[] = [];

    await new Promise<void>((resolve, reject) => {
      Readable.from(file.buffer)
        .pipe(csv())
        .on('data', (row: CsvRow) => {
          const studentDto: CreateStudentDto = {
            first_name: row.first_name,
            last_name: row.last_name,
            email: row.email,
            gender: row.gender as StudentGender,
            dob: row.dob,
            mobile_number: row.mobile_number,
            password: row.password,
            section_id: body.section_id,
            academic_year_id: body.academic_year_id,
            school_id: body.school_id,
            tenant_id: this.tenantContext.getTenantId(), // ✅ USE ACTUAL TENANT ID
          };
          studentsToCreate.push(studentDto);
        })
        .on('end', () => resolve())
        .on('error', (error) => reject(error));
    });

    if (studentsToCreate.length === 0) {
      throw new BadRequestException('The CSV file is empty or invalid.');
    }

    return this._transactionalBulkCreate(studentsToCreate);
  }

  private async _transactionalBulkCreate(
    createStudentDtos: CreateStudentDto[],
  ): Promise<Student[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const createdStudents: Student[] = [];
    try {
      const year = new Date().getFullYear();
      let studentCountInYear = await queryRunner.manager.count(Student, {
        where: {
          admission_no: Like(`GKL${year}%`),
          tenant_id: this.tenantContext.getTenantId(), // ✅ ADD TENANT FILTER
        },
      });

      for (const createStudentDto of createStudentDtos) {
        const { section_id, academic_year_id, school_id, ...studentData } =
          createStudentDto;
        const section = await queryRunner.manager.findOneBy(Section, {
          id: section_id,
        });
        if (!section) {
          throw new NotFoundException(
            `Section with ID "${section_id}" not found.`,
          );
        }
        studentCountInYear++;
        const admission_no = `GKL${year}${studentCountInYear
          .toString()
          .padStart(4, '0')}`;
        const sectionStudentCount = await queryRunner.manager.count(
          Enrollment,
          {
            where: { section: { id: section_id }, academic_year_id },
          },
        );
        const roll_number = (sectionStudentCount + 1).toString();

        const studentEntityData: Partial<Student> = {
          ...studentData,
          dob: studentData.dob ? new Date(studentData.dob) : undefined,
          tenant_id: this.tenantContext.getTenantId(), // ✅ USE ACTUAL TENANT ID
          campus_id: school_id, // Still temporary
          admission_no,
        };

        const student = new Student();
        Object.assign(student, studentEntityData);
        const newStudent = await queryRunner.manager.save(student);

        const enrollment = new Enrollment();
        enrollment.student = newStudent;
        enrollment.section = section;
        enrollment.academic_year_id = academic_year_id;
        enrollment.roll_number = roll_number;

        await queryRunner.manager.save(enrollment);
        createdStudents.push(newStudent);
      }

      await queryRunner.commitTransaction();
      return createdStudents;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      throw new InternalServerErrorException(
        'An error occurred during the bulk create process. No students were created.',
        errorMessage,
      );
    } finally {
      await queryRunner.release();
    }
  }

  // ✅ UPDATED: Add tenant filtering to findAll
  findAll() {
    const tenantId = this.tenantContext.getTenantId();
    return this.studentRepository.find({
      where: { tenant_id: tenantId }, // ✅ ADD TENANT FILTER
      relations: [
        'enrollments',
        'enrollments.section',
        'enrollments.section.class',
      ],
    });
  }

  // ✅ UPDATED: Add tenant filtering to findOne
  async findOne(id: string): Promise<Student> {
    const tenantId = this.tenantContext.getTenantId();
    const student = await this.studentRepository.findOne({
      where: {
        id,
        tenant_id: tenantId, // ✅ ADD TENANT FILTER
      },
      relations: [
        'enrollments',
        'enrollments.section',
        'enrollments.section.class',
      ],
    });
    if (!student) {
      throw new NotFoundException(`Student with ID #${id} not found`);
    }
    return student;
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const { dob, ...restOfDto } = updateStudentDto;
    const payload: Partial<Student> = { ...restOfDto };

    if (dob) {
      payload.dob = new Date(dob);
    }

    const tenantId = this.tenantContext.getTenantId();
    const student = await this.studentRepository.preload({
      id: id,
      ...payload,
    });

    if (!student || student.tenant_id !== tenantId) {
      // ✅ ADD TENANT CHECK
      throw new NotFoundException(`Student with ID #${id} not found`);
    }

    return this.studentRepository.save(student);
  }

  // ✅ UPDATED: Add tenant filtering to remove
  async remove(id: string): Promise<void> {
    const tenantId = this.tenantContext.getTenantId();
    const result = await this.studentRepository.softDelete({
      id,
      tenant_id: tenantId, // ✅ ADD TENANT FILTER
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID #${id} not found`);
    }
  }

  // ✅ UPDATED: Add tenant filtering to dashboard metrics
  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const tenantId = this.tenantContext.getTenantId();

    const activeStudents = await this.studentRepository.count({
      where: { tenant_id: tenantId },
    });

    const totalStudents = await this.studentRepository.count({
      where: { tenant_id: tenantId },
      withDeleted: true,
    });

    const newAdmissionsThisMonth = await this.studentRepository.count({
      where: {
        tenant_id: tenantId,
        created_at: MoreThan(new Date(new Date().setDate(1))),
      },
    });

    const genderCounts: GenderCount[] = await this.studentRepository
      .createQueryBuilder('student')
      .select('student.gender', 'gender')
      .addSelect('COUNT(student.id)', 'count')
      .where('student.tenant_id = :tenantId', { tenantId }) // ✅ ADD TENANT FILTER
      .groupBy('student.gender')
      .getRawMany();

    const genderRatio = genderCounts.reduce(
      (acc, item: GenderCount) => {
        const gender = item.gender?.toLowerCase();
        if (gender === 'male') {
          acc.male += parseInt(item.count, 10);
        } else if (gender === 'female') {
          acc.female += parseInt(item.count, 10);
        }
        return acc;
      },
      { male: 0, female: 0 },
    );

    return {
      totalStudents,
      activeStudents,
      newAdmissionsThisMonth,
      genderRatio,
    };
  }
}
