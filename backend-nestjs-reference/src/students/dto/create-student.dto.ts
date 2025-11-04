import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  IsEmail,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { StudentGender } from '../entities/student.entity';

export class CreateStudentDto {
  // Required IDs from context (e.g., user's session)
  @IsString()
  @IsNotEmpty()
  tenant_id: string;

  @IsString()
  @IsNotEmpty()
  school_id: string;

  // Personal Details
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  last_name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  mobile_number?: string;

  @IsEnum(StudentGender)
  @IsOptional()
  gender?: StudentGender;

  @IsDateString()
  @IsOptional()
  dob?: string;

  // Fields for creating the student's FIRST enrollment
  @IsUUID()
  @IsNotEmpty()
  section_id: string;

  @IsString()
  @IsNotEmpty()
  academic_year_id: string;
}
