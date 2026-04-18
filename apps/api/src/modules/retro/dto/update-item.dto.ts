import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateItemDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sectionId?: string;
}
