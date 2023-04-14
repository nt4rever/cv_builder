import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCvStorageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  templateId: string;
}
