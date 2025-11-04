import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import express from 'express';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('dashboard/metrics')
  getDashboardMetrics() {
    return this.studentsService.getDashboardMetrics();
  }

  @Get('bulk-template')
  getBulkCreateTemplate(@Res() res: express.Response) {
    const csvString =
      'first_name,last_name,email,gender,dob,mobile_number,password';
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=student_bulk_template.csv',
    );
    res.send(csvString);
  }

  @Post('bulk-create')
  @UseInterceptors(FileInterceptor('file'))
  bulkCreateStudents(
    @UploadedFile() file: Express.Multer.File,
    @Body('section_id') section_id: string,
    @Body('academic_year_id') academic_year_id: string,
    @Body('school_id') school_id: string,
    @Body('tenant_id') tenant_id: string,
  ) {
    if (!file) {
      throw new BadRequestException('CSV file is required.');
    }
    const requiredBodyFields = {
      section_id,
      academic_year_id,
      school_id,
      tenant_id,
    };
    return this.studentsService.bulkCreate(file, requiredBodyFields);
  }

  @Post()
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
