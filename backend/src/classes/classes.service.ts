import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  create(createClassDto: CreateClassDto) {
    const completeDto = {
      ...createClassDto,
      tenant_id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
      school_id: 'scl-11223344-5566-7788-9900-aabbccddeeff',
      academic_year_id: 'acy-2025-2026',
    };
    const newClass = this.classRepository.create(completeDto);
    return this.classRepository.save(newClass);
  }

  async findAll(): Promise<any[]> {
    const classes = await this.classRepository.find({
      relations: ['sections'],
    });

    // Simulate additional data for the frontend
    return classes.map((cls) => ({
      ...cls,
      studentCount: cls.sections.length * 28, // Placeholder
      avgAccuracy: 75 + (cls.name.length % 10), // Placeholder
    }));
  }

  async findOne(id: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['sections'],
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID #${id} not found`);
    }
    return classEntity;
  }

  async update(id: string, updateClassDto: UpdateClassDto) {
    const classEntity = await this.findOne(id);
    this.classRepository.merge(classEntity, updateClassDto);
    return this.classRepository.save(classEntity);
  }

  async remove(id: string) {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Class with ID #${id} not found`);
    }
  }
}
