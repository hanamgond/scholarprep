// Alternative simpler migration if you're still having issues:
import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnableRls1730000000000 implements MigrationInterface {
  name = 'EnableRls1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Just enable RLS for now - we'll add policies later
    await queryRunner.query(`ALTER TABLE students ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE students DISABLE ROW LEVEL SECURITY;`);
  }
}
