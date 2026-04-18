import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  boardId!: string;

  @IsString()
  @IsNotEmpty()
  sectionId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content!: string;
}
