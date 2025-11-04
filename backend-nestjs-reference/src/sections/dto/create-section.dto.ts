import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  tenant_id: string;

  @IsUUID()
  @IsNotEmpty()
  class_id: string; // The UUID of the parent class

  @IsString()
  @IsNotEmpty()
  name: string; // e.g., "A", "B"
}
