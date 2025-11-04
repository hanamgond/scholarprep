// backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './students/students.module';
import { ClassesModule } from './classes/classes.module';
import { SectionsModule } from './sections/sections.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { TenantGuard } from './common/guards/tenant.guard';
import { TenantsModule } from './tenants/tenants.module';
import { CampusesModule } from './campuses/campuses.module';

@Module({
  imports: [
    // Rate limiting - protect against brute force
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    // Health module
    HealthModule,
    // Database configuration
    TypeOrmModule.forRoot({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgres://hanamgondvagge@localhost:5432/scholarprep',
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
      ssl:
        process.env.DATABASE_URL &&
        process.env.DATABASE_URL.includes('supabase.co')
          ? { rejectUnauthorized: false }
          : undefined,
    }),
    // Security modules
    AuthModule,
    CommonModule,
    // Tenant management modules
    TenantsModule,
    CampusesModule,
    // Feature modules
    StudentsModule,
    ClassesModule,
    SectionsModule,
    EnrollmentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global tenant guard (applies to all routes except public ones)
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}
