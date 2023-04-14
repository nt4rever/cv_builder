import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CategoryTemplate } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class ThemeDTO {
  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'HEX color not match',
  })
  primaryText: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'HEX color not match',
  })
  sectionTitle: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'HEX color not match',
  })
  monogramBackground: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'HEX color not match',
  })
  monogramText: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'HEX color not match',
  })
  background: string;
}

export class CreateTemplateDTO {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

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
  @IsNotEmpty()
  urlImage: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CategoryTemplate)
  category: CategoryTemplate;
}
