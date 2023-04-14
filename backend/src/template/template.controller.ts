import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TemplateService } from './template.service';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateTemplateDTO, UpdateTemplateDTO } from './dto';

@Controller('template')
@ApiTags('template')
export class TemplateController {
  constructor(private templateService: TemplateService) {}

  @Post('create')
  @ApiOperation({
    summary: 'Create a new template',
  })
  create(@Body() dto: CreateTemplateDTO) {
    return this.templateService.create(dto);
  }

  @Get('all')
  @ApiOperation({
    summary: 'Get all templates',
  })
  getAll() {
    return this.templateService.getAll();
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Get all templates by category',
  })
  getByCategory(@Param('category') category: string) {
    return this.templateService.getByCategory(category);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a template by id',
  })
  getById(@Param('id') id: string) {
    return this.templateService.getById(id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a template by id',
  })
  deleteById(@Param('id') id: string) {
    return this.templateService.deleteById(id);
  }

  @Post('update/:id')
  @ApiOperation({
    summary: 'Update a template by id',
  })
  updateById(@Param('id') id: string, @Body() dto: UpdateTemplateDTO) {
    return this.templateService.updateById(id, dto);
  }
}
