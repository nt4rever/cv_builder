import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  Matches,
  MaxLength,
} from 'class-validator';

export class ContactDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @Matches(/^[+]?[\d\s]*$/g, {
    message: 'phone must be a valid phone number',
  })
  @IsOptional()
  phone?: string;
}
