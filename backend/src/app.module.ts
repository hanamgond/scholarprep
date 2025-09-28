import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { HealthController } from './health/health.controller'; // 👈 import
import { ClassesModule } from './classes/classes.module';
import { SectionsModule } from './sections/sections.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'hanamgondvagge',
      password: '',
      database: 'scholarprep',
      autoLoadEntities: true,
      synchronize: true,
    }),
    StudentsModule,
    ClassesModule,
    SectionsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController, HealthController], // 👈 add here
  providers: [AppService],
})
export class AppModule {}
