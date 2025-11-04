// backend/src/campuses/campuses.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Campus } from './entities/campus.entity';

@Injectable()
export class CampusesService {
  constructor(
    @InjectRepository(Campus)
    private campusesRepository: Repository<Campus>,
  ) {}

  async findAll(): Promise<Campus[]> {
    return this.campusesRepository.find();
  }

  async findOne(id: string): Promise<Campus> {
    const campus = await this.campusesRepository.findOne({ where: { id } });
    if (!campus) {
      throw new NotFoundException(`Campus with ID ${id} not found`);
    }
    return campus;
  }
}
