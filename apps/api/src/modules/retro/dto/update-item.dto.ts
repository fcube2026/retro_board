import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  sectionId?: string;
}
