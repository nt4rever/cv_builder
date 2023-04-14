import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangeTemplateDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(24)
  cvId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(24)
  templateId: string;
}
