import { ShareService } from './share.service';
import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { ExportDTO, ThumbnailDTO } from './dto';

@ApiTags('share cv')
@Controller('share')
export class ShareController {
  constructor(private shareService: ShareService) {}

  @ApiBearerAuth()
  @Get('/:id')
  getCV(@Param('id') cvStorageId: string, @Req() req: Request) {
    return this.shareService.getCV(cvStorageId, req);
  }

  @Post('pdf')
  async exportPDF(@Body() dto: ExportDTO) {
    return this.shareService.exportPDF(dto);
  }

  @Post('png')
  async exportPNG(@Body() dto: ExportDTO) {
    return this.shareService.exportPNG(dto);
  }

  @Post('thumbnail')
  async saveThumbnail(@Body() dto: ThumbnailDTO) {
    return this.shareService.saveThumbnail(dto);
  }
}
