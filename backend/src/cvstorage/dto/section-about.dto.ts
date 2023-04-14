import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  MaxLength,
  IsNotEmpty,
  Length,
} from 'class-validator';

export class SectionAboutDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  cvStorageId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @MaxLength(1000)
  @ApiProperty()
  @IsString()
  @IsOptional()
  summary?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @Matches(/^[+]?[\d\s]*$/g, {
    message: 'Phone must be a valid phone number',
  })
  @IsOptional()
  phone?: string;
}
