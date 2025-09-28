import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { Section } from './entities/section.entity';
import { Class } from '../classes/entities/class.entity'; // 👈 Import the Class entity

@Module({
  imports: [TypeOrmModule.forFeature([Section, Class])], // 👈 Add Class here
  controllers: [SectionsController],
  providers: [SectionsService],
})
export class SectionsModule {}
