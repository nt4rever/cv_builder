import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class SortSectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  cVStorageId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  sectionId: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  prev?: number;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  next?: number;
}
