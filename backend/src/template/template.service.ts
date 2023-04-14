import { TEMPLATE_MESSAGE } from './../utils/messages';
import { CategoryTemplate } from './../utils/enum/index';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTemplateDTO, UpdateTemplateDTO } from './dto';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTemplateDTO) {
    try {
      const { theme, ...template } = dto;
      return await this.prisma.template.create({
        data: {
          theme,
          ...template,
        },
      });
    } catch (error) {
      throw new ForbiddenException(TEMPLATE_MESSAGE.CREATE_FAILED);
    }
  }

  async getAll() {
    try {
      return await this.prisma.template.findMany({
        where: {},
      });
    } catch (error) {
      throw new ForbiddenException(TEMPLATE_MESSAGE.GET_ALL_FAILED);
    }
  }

  async getByCategory(category: string) {
    try {
      if (category in CategoryTemplate) {
        return await this.prisma.template.findMany({
          where: {
            category: CategoryTemplate[category],
          },
        });
      } else {
        return [];
      }
    } catch (error) {
      throw new ForbiddenException(TEMPLATE_MESSAGE.GET_BY_CATEGORY_FAILED);
    }
  }

  async getById(id: string) {
    try {
      return await this.prisma.template.findFirstOrThrow({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new ForbiddenException(TEMPLATE_MESSAGE.NOT_FOUND);
    }
  }

  async deleteById(id: string) {
    try {
      await this.prisma.template.delete({
        where: {
          id: id,
        },
      });
      return { message: TEMPLATE_MESSAGE.DELETED };
    } catch (error) {
      throw new ForbiddenException(TEMPLATE_MESSAGE.DELETE_FAILED);
    }
  }

  async updateById(id: string, dto: UpdateTemplateDTO) {
    try {
      return await this.prisma.template.update({
        where: {
          id: id,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw new ForbiddenException(TEMPLATE_MESSAGE.UPDATE_FAILED);
    }
  }
}
