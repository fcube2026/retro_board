import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSectionDto {
  @IsUUID()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsInt()
  order?: number;
}