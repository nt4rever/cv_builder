import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class SortSectionContentDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  sectionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  contentId: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  prev?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  next?: number;
}
