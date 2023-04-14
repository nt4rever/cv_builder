import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class DeleteContentSectionDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(24)
  sectionId: string;
}
