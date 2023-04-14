import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  Length,
  ValidateNested,
  IsArray,
  IsNumber,
  IsBoolean,
} from 'class-validator';

class DetailDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subTitle: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;
}

class StandardDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  stop?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  current?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class ContentSectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  sectionId: string;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DetailDTO)
  detail?: DetailDTO;

  @ApiProperty()
  @ValidateNested()
  @Type(() => StandardDTO)
  standard?: StandardDTO;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tag?: string[];
}
