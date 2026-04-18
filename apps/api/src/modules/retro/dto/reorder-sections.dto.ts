import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ReorderSectionEntry {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsInt()
  @Min(0)
  order!: number;
}

export class ReorderSectionsDto {
  @IsString()
  @IsNotEmpty()
  boardId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReorderSectionEntry)
  sections!: ReorderSectionEntry[];
}
