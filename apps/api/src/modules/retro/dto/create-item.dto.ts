import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
  @IsUUID()
  boardId: string;

  @IsUUID()
  sectionId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}