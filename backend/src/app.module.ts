import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { HealthController } from './health/health.controller';
import { ClassesModule } from './classes/classes.module';
import { SectionsModule } from './sections/sections.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgres://hanamgondvagge@localhost:5432/scholarprep',
      autoLoadEntities: true,
      synchronize: true, // ✅ Turn on only for testing (false for production + migrations)
      ssl:
        process.env.DATABASE_URL &&
        process.env.DATABASE_URL.includes('supabase.co')
          ? { rejectUnauthorized: false }
          : undefined,
    }),
    StudentsModule,
    ClassesModule,
    SectionsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
