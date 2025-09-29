import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// FIX: Use modern ESM import for csv-parser
import csv from 'csv-parser';
import { Readable } from 'stream';
import { DataSource, Like, MoreThan, Repository } from 'typeorm';
import { CreateStudentDto } from './dto/create-student.dto';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { Section } from '../sections/entities/section.entity';
import { Student, StudentGender } from './entities/student.entity';

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
        where: { admission_no: Like(`GKL${year}%`) },
      });
      const admission_no = `GKL${year}${(studentCountInYear + 1)
        .toString()
        .padStart(4, '0')}`;

      const sectionStudentCount = await queryRunner.manager.count(Enrollment, {
        where: { section: { id: section_id }, academic_year_id },
      });
      const roll_number = (sectionStudentCount + 1).toString();

      const studentEntityData = {
        ...studentData,
        dob: studentData.dob ? new Date(studentData.dob) : undefined,
        school_id,
        admission_no,
      };

      const student = this.studentRepository.create(studentEntityData);
      const newStudent = await queryRunner.manager.save(student);

      const enrollment = this.enrollmentRepository.create({
        student: newStudent,
        section: section,
        academic_year_id,
        roll_number,
      });
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!file || !file.buffer) {
      throw new BadRequestException('The uploaded file is empty.');
    }

    const studentsToCreate: CreateStudentDto[] = [];

    await new Promise<void>((resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
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
            tenant_id: body.tenant_id,
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

  /**
   * FIX: The logic for this method has been fully restored.
   */
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
        where: { admission_no: Like(`GKL${year}%`) },
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
        const student = this.studentRepository.create({
          ...studentData,
          dob: studentData.dob ? new Date(studentData.dob) : undefined,
          school_id,
          admission_no,
        });
        const newStudent = await queryRunner.manager.save(student);
        const enrollment = this.enrollmentRepository.create({
          student: newStudent,
          section,
          academic_year_id,
          roll_number,
        });
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

  findAll() {
    return this.studentRepository.find({
      relations: [
        'enrollments',
        'enrollments.section',
        'enrollments.section.class',
      ],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
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

  /**
   * FIX: A cleaner, fully type-safe implementation for the update payload.
   */
  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const { dob, ...restOfDto } = updateStudentDto;
    const payload: Partial<Student> = { ...restOfDto };

    if (dob) {
      payload.dob = new Date(dob);
    }

    const student = await this.studentRepository.preload({
      id: id,
      ...payload,
    });
    if (!student) {
      throw new NotFoundException(`Student with ID #${id} not found`);
    }
    return this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const result = await this.studentRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Student with ID #${id} not found`);
    }
  }

  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const activeStudents = await this.studentRepository.count();
    const totalStudents = await this.studentRepository.count({
      withDeleted: true,
    });
    const newAdmissionsThisMonth = await this.studentRepository.count({
      where: { created_at: MoreThan(new Date(new Date().setDate(1))) },
    });
    const genderCounts: GenderCount[] = await this.studentRepository
      .createQueryBuilder('student')
      .select('student.gender', 'gender')
      .addSelect('COUNT(student.id)', 'count')
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
