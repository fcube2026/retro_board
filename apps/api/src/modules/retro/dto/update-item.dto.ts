import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;
}