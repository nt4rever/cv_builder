import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ShareCvDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean;
}
