import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
  @IsUUID()
  boardId: string;

  @IsUUID()
  sectionId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  createdByName?: string;
}