// backend/src/migrations/1730000000001-fix-campus-id.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixCampusId1730000000001 implements MigrationInterface {
  name = 'FixCampusId1730000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First, create a default campus for existing tenants
    await queryRunner.query(`
      INSERT INTO campuses (id, name, code, tenant_id, is_active, created_at, updated_at)
      SELECT 
        gen_random_uuid(),
        'Main Campus',
        'MAIN',
        id,
        true,
        NOW(),
        NOW()
      FROM tenants
      ON CONFLICT DO NOTHING
    `);

    // Then update existing students to use the default campus
    await queryRunner.query(`
      UPDATE students s
      SET campus_id = c.id
      FROM campuses c
      WHERE s.tenant_id = c.tenant_id 
      AND s.campus_id IS NULL
    `);

    // Now make campus_id non-nullable
    await queryRunner.query(`
      ALTER TABLE students 
      ALTER COLUMN campus_id SET NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE students 
      ALTER COLUMN campus_id DROP NOT NULL
    `);
  }
}
