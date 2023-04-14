import { CVSection } from './../../utils/enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class CreateSectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  cVStorageId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  heading: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CVSection)
  type: CVSection;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;
}
