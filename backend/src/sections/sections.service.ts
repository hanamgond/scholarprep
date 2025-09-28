import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';
import { Class } from '../classes/entities/class.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    const { name, class_id, tenant_id } = createSectionDto;

    const parentClass = await this.classRepository.findOneBy({ id: class_id });
    if (!parentClass) {
      throw new NotFoundException(`Class with ID "${class_id}" not found`);
    }

    const newSection = this.sectionRepository.create({
      name,
      tenant_id,
      class: parentClass,
    });

    return this.sectionRepository.save(newSection);
  }

  findAll() {
    return this.sectionRepository.find({ relations: ['class'] });
  }

  async findOne(id: string) {
    const section = await this.sectionRepository.findOne({
      where: { id },
      relations: ['class'],
    });
    if (!section) {
      throw new NotFoundException(`Section with ID #${id} not found`);
    }
    return section;
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    const section = await this.findOne(id);
    this.sectionRepository.merge(section, updateSectionDto);
    return this.sectionRepository.save(section);
  }

  async remove(id: string) {
    // Using softDelete because our BaseEntity has a deleted_at column
    const result = await this.sectionRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Section with ID #${id} not found`);
    }
  }
}
