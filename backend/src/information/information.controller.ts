import { InformationService } from './information.service';
import { GetUser } from './../auth/decorator';
import { JwtGuard } from './../auth/guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AboutDTO, ContactDTO, EducationDTO, WorkDTO } from './dto';
import { User } from '@prisma/client';

@Controller('information')
@ApiTags('cv information')
export class InformationController {
  constructor(private informationService: InformationService) {}
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('/')
  @ApiOperation({
    summary: 'Get full cv information, need access_token',
  })
  getInformation(@GetUser() user: User) {
    return this.informationService.cVInformation(user);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('work')
  @ApiOperation({
    summary: 'Create new work experience in cv information',
  })
  createWork(@Body() dto: WorkDTO, @GetUser() user: User) {
    return this.informationService.createWork(user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('work/:id')
  @ApiOperation({
    summary: 'Delete work experience by id',
  })
  deleteWork(@Param('id') id: string) {
    return this.informationService.deleteWork(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('work/:id')
  @ApiOperation({
    summary: 'Update work experience by id',
  })
  updateWork(@Param('id') id: string, @Body() dto: WorkDTO) {
    return this.informationService.updateWork(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('education')
  @ApiOperation({
    summary: 'Create new education in cv information',
  })
  createEducation(@Body() dto: EducationDTO, @GetUser() user: User) {
    return this.informationService.createEducation(user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('education/:id')
  @ApiOperation({
    summary: 'Delete education by id',
  })
  deleteEducation(@Param('id') id: string) {
    return this.informationService.deleteEducation(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch('education/:id')
  @ApiOperation({
    summary: 'Update education by id',
  })
  updateEducation(@Param('id') id: string, @Body() dto: EducationDTO) {
    return this.informationService.updateEducation(id, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('about')
  @ApiOperation({
    summary: 'Update about section in cv information',
  })
  updateAbout(@Body() dto: AboutDTO, @GetUser() user: User) {
    return this.informationService.about(user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post('contact')
  @ApiOperation({
    summary: 'Update contact section in cv information',
  })
  updateContact(@Body() dto: ContactDTO, @GetUser() user: User) {
    return this.informationService.contact(user, dto);
  }
}
