import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateSectionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
