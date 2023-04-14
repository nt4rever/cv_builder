import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ThumbnailDTO {
  @ApiProperty()
  @IsNotEmpty()
  cvUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  cvStorageId: string;
}
