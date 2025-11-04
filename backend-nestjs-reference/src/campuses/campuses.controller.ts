// backend/src/campuses/campuses.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { CampusesService } from './campuses.service';
import { Campus } from './entities/campus.entity';

@Controller('campuses')
export class CampusesController {
  constructor(private readonly campusesService: CampusesService) {}

  @Get()
  async findAll(): Promise<Campus[]> {
    return this.campusesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Campus> {
    return this.campusesService.findOne(id);
  }
}
