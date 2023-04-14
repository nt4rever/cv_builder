import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';

export class WorkDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  company: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  jobTitle: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyWebsite?: string;

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
