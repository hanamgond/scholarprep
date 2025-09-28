import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, MoreThanOrEqual, EntityManager } from 'typeorm';
import {
  Student,
  StudentGender,
  StudentStatus,
} from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Section } from '../sections/entities/section.entity';
import { Enrollment } from '../enrollments/entities/enrollment.entity';
import { DashboardMetricsDto } from './dto/dashboard-metrics.dto';
import * as csv from 'fast-csv';
import { Readable } from 'stream';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Enrollment)
    private readonly enrollmentRepository: Repository<Enrollment>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const { section_id, academic_year_id, school_id, ...studentData } =
      createStudentDto;
    const section = await this.sectionRepository.findOneBy({ id: section_id });
    if (!section) {
      throw new NotFoundException(`Section with ID "${section_id}" not found`);
    }
    const year = new Date().getFullYear();
    const studentCountInYear = await this.studentRepository.count({
      where: { admission_no: Like(`GKL${year}%`) },
    });
    const admission_no = `GKL${year}${(studentCountInYear + 1)
      .toString()
      .padStart(4, '0')}`;
    const sectionStudentCount = await this.enrollmentRepository.count({
      where: { section: { id: section_id }, academic_year_id },
    });
    const roll_number = (sectionStudentCount + 1).toString();
    const student = this.studentRepository.create({
      ...studentData,
      school_id,
      admission_no,
    });
    const newStudent = await this.studentRepository.save(student);
    const enrollment = this.enrollmentRepository.create({
      student: newStudent,
      section,
      academic_year_id,
      roll_number,
    });
    await this.enrollmentRepository.save(enrollment);
    return newStudent;
  }

  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const totalStudents = await this.studentRepository.count({
      // FIX (Line 67): Prettier formatting applied here.
      withDeleted: true,
    });
    const activeStudents = await this.studentRepository.count({
      where: { status: StudentStatus.ACTIVE },
    });
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const newAdmissionsThisMonth = await this.studentRepository.count({
      where: { created_at: MoreThanOrEqual(firstDayOfMonth) },
    });
    const maleCount = await this.studentRepository.count({
      where: { gender: StudentGender.MALE },
    });
    const femaleCount = await this.studentRepository.count({
      where: { gender: StudentGender.FEMALE },
    });

    // FIX (Line 88): This return object now correctly matches the updated
    // DashboardMetricsDto definition, which includes `activeStudents`.
    return {
      totalStudents,
      newAdmissionsThisMonth,
      activeStudents,
      genderRatio: { male: maleCount, female: femaleCount },
    };
  }

  async findAll(): Promise<any[]> {
    const students = await this.studentRepository.find({
      relations: [
        'enrollments',
        'enrollments.section',
        'enrollments.section.class',
      ],
    });

    // Simulate rich data for the frontend UI
    return students.map((student, index) => {
      const currentEnrollment = student.enrollments?.[0];
      const accuracy = 80 + (index % 20);
      return {
        ...student,
        track: ['NEET Preparation', 'JEE Preparation', 'Board Preparation'][
          index % 3
        ],
        rank: index + 1,
        metrics: {
          accuracyPct: accuracy,
          accuracyDelta: Number((Math.random() * 5 - 2.5).toFixed(1)),
          qpm: Number((1.0 + (index % 10) / 10).toFixed(1)),
          qpmDelta: Number((Math.random() * 0.4 - 0.2).toFixed(1)),
          consistencyPct: accuracy - 5 - (index % 10),
          consistencyDelta: Number((Math.random() * 5 - 2.5).toFixed(1)),
        },
        className: currentEnrollment?.section?.class?.name ?? 'N/A',
        sectionName: currentEnrollment?.section?.name ?? 'N/A',
      };
    });
  }

  // REFACTORED: This entire function is updated for type safety, correct promise handling, and proper database transactions.
  async bulkCreate(
    file: Express.Multer.File,
    body: {
      section_id: string;
      academic_year_id: string;
      school_id: string;
      tenant_id: string;
    },
  ): Promise<{ message: string }> {
    const { section_id, academic_year_id, school_id, tenant_id } = body;

    // FIX (Line 137): Check if file and buffer exist to avoid unsafe member access on `file.buffer`.
    if (!file || !file.buffer) {
      throw new BadRequestException('CSV file or buffer is missing.');
    }

    const studentsToCreate: CreateStudentDto[] = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv.parse({ headers: true, discardUnmappedColumns: true }))
        // FIX (Line 137): Type the error object to avoid unsafe member access on `error.message`.
        .on('error', (error: Error) =>
          reject(new BadRequestException(`CSV parsing error: ${error.message}`)),
        )
        // FIX (Line 144): Explicitly cast `row` to create a typed DTO. This resolves the "unsafe argument" error.
        .on('data', (row: any) => {
          const dto: CreateStudentDto = {
            ...row, // Spread raw data from CSV row
            section_id,
            academic_year_id,
            school_id,
            tenant_id,
          };
          studentsToCreate.push(dto);
        })
        // FIX (Line 152): Removed `async` from the handler to resolve the "misused promise" error.
        // Promise-based logic is now handled inside with `.then()` and `.catch()`.
        .on('end', (rowCount: number) => {
          this.studentRepository.manager
            .transaction(async (transactionalEntityManager) => {
              const studentRepo =
                transactionalEntityManager.getRepository(Student);
              const sectionRepo =
                transactionalEntityManager.getRepository(Section);
              const enrollmentRepo =
                transactionalEntityManager.getRepository(Enrollment);

              // FIX (Line 156): Prettier formatting applied here.
              const creationPromises = studentsToCreate.map(
                async (dto: CreateStudentDto) => {
                  // --- Re-implementing `create` logic using the transactional manager for atomicity ---
                  const {
                    section_id,
                    academic_year_id,
                    school_id,
                    ...studentData
                  } = dto;
                  const section = await sectionRepo.findOneBy({
                    id: section_id,
                  });
                  if (!section) {
                    throw new NotFoundException(
                      `Section with ID "${section_id}" not found`,
                    );
                  }
                  const year = new Date().getFullYear();
                  const studentCountInYear = await studentRepo.count({
                    where: { admission_no: Like(`GKL${year}%`) },
                  });
                  const admission_no = `GKL${year}${(studentCountInYear + 1)
                    .toString()
                    .padStart(4, '0')}`;
                  const sectionStudentCount = await enrollmentRepo.count({
                    where: { section: { id: section_id }, academic_year_id },
                  });
                  const roll_number = (sectionStudentCount + 1).toString();
                  const student = studentRepo.create({
                    ...studentData,
                    school_id,
                    admission_no,
                  });
                  const newStudent = await studentRepo.save(student);
                  const enrollment = enrollmentRepo.create({
                    student: newStudent,
                    section,
                    academic_year_id,
                    roll_number,
                  });
                  await enrollmentRepo.save(enrollment);
                  return newStudent;
                },
              );
              return Promise.all(creationPromises);
            })
            .then((created) => {
              resolve({
                message: `${created.length} of ${rowCount} students created.`,
              });
            })
            // FIX (Line 165): Safely handle the transaction error by checking its type.
            .catch((error: unknown) => {
              if (error instanceof Error) {
                reject(
                  new BadRequestException(
                    `Transaction failed: ${error.message}`,
                  ),
                );
              } else {
                reject(
                  new BadRequestException(
                    'An unknown error occurred during the transaction.',
                  ),
                );
              }
            });
        });
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

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.studentRepository.preload({
      id: id,
      ...updateStudentDto,
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
}

