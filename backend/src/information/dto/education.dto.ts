import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class EducationDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  school: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  degree: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  schoolWebsite?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  stop?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
