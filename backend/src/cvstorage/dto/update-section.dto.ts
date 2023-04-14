import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class UpdateSectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  sectionId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  heading: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  order?: number;
}
