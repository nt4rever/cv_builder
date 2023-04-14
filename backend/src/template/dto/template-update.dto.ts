import { ThemeDTO } from './template-create.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryTemplate } from '@prisma/client';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateTemplateDTO {
  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => ThemeDTO)
  theme?: ThemeDTO;

  @ApiProperty()
  @IsString()
  @IsOptional()
  urlImage?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(CategoryTemplate)
  category?: CategoryTemplate;
}
