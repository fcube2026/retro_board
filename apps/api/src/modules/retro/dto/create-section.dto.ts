import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber()
  order?: number;

  @IsString()
  @IsNotEmpty()
  createdBy: string;
}
