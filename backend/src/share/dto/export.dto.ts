import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ExportDTO {
  @ApiProperty()
  @IsNotEmpty()
  cvUrl: string;
}
