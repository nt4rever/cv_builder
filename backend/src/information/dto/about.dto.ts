import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class AboutDTO {
  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(100)
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(3000)
  @IsOptional()
  summary?: string;
}
