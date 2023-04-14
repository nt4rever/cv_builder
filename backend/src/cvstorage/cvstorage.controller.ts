import { ThemeDTO } from './../template/dto/template-create.dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from './../auth/decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { CvstorageService } from './cvstorage.service';
import {
  ChangeTemplateDTO,
  ContentSectionDTO,
  CreateCvStorageDTO,
  CreateSectionDTO,
  DeleteContentSectionDTO,
  SectionAboutDTO,
  ShareCvDTO,
  SortSectionContentDTO,
  SortSectionDTO,
  UpdateSectionDTO,
} from './dto';
import { ApiImageFile } from '../decorator';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('cvstorage')
@ApiTags('cv storage')
export class CvstorageController {
  constructor(private cvStorageService: CvstorageService) {}
  @Get('/')
  @ApiOperation({
    summary: 'get all cv storage',
  })
  getCvStorage(@GetUser() user: User) {
    return this.cvStorageService.getAll(user);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'get cv storage by id',
  })
  getCvStorageById(@Param('id') cvStorageId: string, @GetUser() user: User) {
    return this.cvStorageService.getById(cvStorageId, user);
  }

  @Post('/')
  @ApiOperation({
    summary: 'create new cv storage',
  })
  create(@Body() dto: CreateCvStorageDTO, @GetUser() user: User) {
    return this.cvStorageService.createCvStorage(dto, user);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'delete cv storage',
  })
  deleteCvStorage(@Param('id') cvStorageId: string, @GetUser() user: User) {
    return this.cvStorageService.deleteCvStorage(cvStorageId, user);
  }

  @Patch('/about')
  @ApiOperation({
    summary: 'update section about cv storage',
  })
  updateSectionAbout(@Body() dto: SectionAboutDTO, @GetUser() user: User) {
    return this.cvStorageService.updateSectionAbout(dto, user);
  }

  @Post('/section')
  @ApiOperation({
    summary: 'create new  section',
  })
  createSection(@Body() dto: CreateSectionDTO, @GetUser() user: User) {
    return this.cvStorageService.createSection(dto, user);
  }

  @Patch('/section')
  @ApiOperation({
    summary: 'update heading section',
  })
  updateSection(@Body() dto: UpdateSectionDTO, @GetUser() user: User) {
    return this.cvStorageService.updateSection(dto, user);
  }

  @Delete('/section/:id')
  @ApiOperation({
    summary: 'delete section',
  })
  deleteSection(@Param('id') sectionId: string, @GetUser() user: User) {
    return this.cvStorageService.deleteSection(sectionId, user);
  }

  @Post('/section/content')
  @ApiOperation({
    summary: 'create content section',
  })
  createContentSection(@Body() dto: ContentSectionDTO, @GetUser() user: User) {
    return this.cvStorageService.createContentSection(dto, user);
  }

  @Patch('/section/content/:id')
  @ApiOperation({
    summary: 'update content section',
  })
  updateContentSection(
    @Param('id') contentId: string,
    @Body() dto: ContentSectionDTO,
    @GetUser() user: User,
  ) {
    return this.cvStorageService.updateContentSection(contentId, dto, user);
  }

  @Delete('/section/content/:id')
  @ApiOperation({
    summary: 'delete content section',
  })
  deleteContentSection(
    @Param('id') contentId: string,
    @Body() dto: DeleteContentSectionDTO,
    @GetUser() user: User,
  ) {
    return this.cvStorageService.deleteContentSection(contentId, dto, user);
  }

  @Post('/section/sort')
  @ApiOperation({
    summary: 'sort section',
  })
  sortSection(@Body() dto: SortSectionDTO, @GetUser() user: User) {
    return this.cvStorageService.sortSection(dto, user);
  }

  @Post('/section/content/sort')
  @ApiOperation({
    summary: 'sort section content',
  })
  sortSectionContent(
    @Body() dto: SortSectionContentDTO,
    @GetUser() user: User,
  ) {
    return this.cvStorageService.sortSectionContent(dto, user);
  }

  @Patch('/theme/:id')
  @ApiOperation({
    summary: 'update custom theme color cv storage',
  })
  updateHtmlData(
    @Param('id') cvStorageId: string,
    @Body() dto: ThemeDTO,
    @GetUser() user: User,
  ) {
    return this.cvStorageService.updateThemeColor(cvStorageId, dto, user);
  }

  @Post('/avatar/:id')
  @ApiImageFile('avatar', true)
  @ApiOperation({
    summary: 'upload avatar cv storage',
  })
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Param('id') cvStorageId: string,
    @GetUser() user: User,
  ) {
    return this.cvStorageService.uploadAvatar(cvStorageId, file, user);
  }

  @Post('/share/:id')
  @ApiOperation({
    summary: 'change share option cv storage',
  })
  shareCV(
    @Param('id') cvStorageId: string,
    @Body() dto: ShareCvDTO,
    @GetUser() user: User,
  ) {
    return this.cvStorageService.shareCV(cvStorageId, dto, user);
  }

  @Patch('/template')
  @ApiOperation({
    summary: 'change template cv storage',
  })
  changeTemplate(@Body() dto: ChangeTemplateDTO, @GetUser() user: User) {
    return this.cvStorageService.changeTemplate(dto, user);
  }
}
