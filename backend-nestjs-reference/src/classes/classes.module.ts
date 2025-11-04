import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { Class } from './entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Class])], // <-- This makes the Class repository available
  controllers: [ClassesController],
  providers: [ClassesService],
})
export class ClassesModule {}
