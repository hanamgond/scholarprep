// backend/src/campuses/campuses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campus } from './entities/campus.entity';
import { CampusesService } from './campuses.service';
import { CampusesController } from './campuses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Campus])],
  controllers: [CampusesController],
  providers: [CampusesService],
  exports: [CampusesService, TypeOrmModule],
})
export class CampusesModule {}
