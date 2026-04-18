import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  boardId: string;

  @IsString()
  @IsNotEmpty()
  sectionId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  createdByName: string;
}
