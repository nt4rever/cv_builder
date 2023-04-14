import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { ThemeDTO } from './../template/dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AUTH_MESSAGES } from './../utils/messages/auth.message';
import { CV_STORAGE_MESSAGES } from './../utils/messages';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
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
import { CVStorageResponse } from './../utils/types';
import { CVSection } from './../utils/enum';
import { Detail, Standard, User } from '@prisma/client';

@Injectable()
export class CvstorageService {
  constructor(
    private prisma: PrismaService,
    private cloud: CloudinaryService,
  ) {}

  async getAll(user: User) {
    try {
      const storage = await this.prisma.cVStorage.findMany({
        where: {
          userId: user.id,
        },
        select: CVStorageResponse,
      });
      return {
        data: storage,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async getById(cvStorageId: string, user: User) {
    try {
      const cvStorage = await this.authorizeCvStorage(cvStorageId, user);
      delete cvStorage.userId;
      return {
        ...cvStorage,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async createCvStorage(dto: CreateCvStorageDTO, user: User) {
    try {
      const cv = await this.existInformation(user);
      const template = await this.prisma.template.findUnique({
        where: {
          id: dto.templateId,
        },
      });
      const storage = await this.prisma.cVStorage.create({
        data: {
          userId: user.id,
          templateId: dto.templateId,
          about: cv.about,
          contact: cv.contact,
          theme: template.theme,
        },
        select: CVStorageResponse,
      });

      const { work, education } = cv;
      if (work.length > 0) {
        const workSection = await this.prisma.section.create({
          data: {
            cVStorageId: storage.id,
            type: 'STANDARD',
            heading: 'Work Experience',
            order: 1024,
          },
        });
        let workOrderIndex = 0;
        for (const w of work) {
          workOrderIndex += 1024;
          await this.prisma.standard.create({
            data: {
              sectionId: workSection.id,
              name: w.company,
              title: w.jobTitle,
              website: w.companyWebsite,
              start: w.start,
              stop: w.stop,
              description: w.description,
              order: workOrderIndex,
            },
          });
        }
      }
      if (education.length > 0) {
        const educationSection = await this.prisma.section.create({
          data: {
            cVStorageId: storage.id,
            type: 'STANDARD',
            heading: 'Education',
            order: 2048,
          },
        });
        let educationOrderIndex = 0;
        for (const e of education) {
          educationOrderIndex += 1024;
          await this.prisma.standard.create({
            data: {
              sectionId: educationSection.id,
              name: e.school,
              title: e.degree,
              website: e.schoolWebsite,
              start: e.start,
              stop: e.stop,
              description: e.description,
              order: educationOrderIndex,
            },
          });
        }
      }
      return {
        message: CV_STORAGE_MESSAGES.CREATE_SUCCESS,
        data: storage,
      };
    } catch (error) {
      this.handleSectionError(error);
    }
  }

  async deleteCvStorage(cvStorageId: string, user: User) {
    try {
      const cvStorage = await this.authorizeCvStorage(cvStorageId, user);
      await this.prisma.cVStorage.delete({
        where: { id: cvStorage.id },
      });
      return {
        message: CV_STORAGE_MESSAGES.CV_STORAGE_DELETED,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async updateSectionAbout(dto: SectionAboutDTO, user: User) {
    try {
      const { cvStorageId, firstName, lastName, title, summary, ...contact } =
        dto;
      const cvStorage = await this.authorizeCvStorage(cvStorageId, user);
      const about = await this.prisma.cVStorage.update({
        where: {
          id: cvStorage.id,
        },
        data: {
          about: {
            ...cvStorage.about,
            firstName: firstName ? firstName : cvStorage.about.firstName,
            lastName: lastName ? lastName : cvStorage.about.lastName,
            title: title ? title : cvStorage.about.title,
            summary: summary ? summary : cvStorage.about.summary,
          },
          contact: {
            ...cvStorage.contact,
            ...contact,
          },
        },
        select: CVStorageResponse,
      });
      return {
        message: CV_STORAGE_MESSAGES.CV_STORAGE_UPDATED,
        data: about,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async createSection(dto: CreateSectionDTO, user: User) {
    try {
      const storage = await this.authorizeCvStorage(dto.cVStorageId, user);
      let orderIndex = 1024;
      if (storage.sections.length > 0) {
        const lastSection = storage.sections.reduce((prev, current) =>
          prev.order > current.order ? prev : current,
        );
        orderIndex += lastSection.order;
      }

      const section = await this.prisma.section.create({
        data: {
          ...dto,
          order: dto.order ? dto.order : orderIndex,
        },
      });
      delete section.cVStorageId;
      delete section.tags;
      return {
        message: CV_STORAGE_MESSAGES.SECTION_CREATED,
        section,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async updateSection(dto: UpdateSectionDTO, user: User) {
    try {
      const section = await this.authorizeSection(dto.sectionId, user.id);

      const updateSection = await this.prisma.section.update({
        where: {
          id: section.id,
        },
        data: {
          heading: dto.heading,
          order: dto.order ? dto.order : section.order,
        },
      });
      delete updateSection.cVStorageId;
      delete updateSection.tags;
      return {
        message: CV_STORAGE_MESSAGES.SECTION_UPDATED,
        section: updateSection,
      };
    } catch (error) {
      this.handleSectionError(error);
    }
  }

  async deleteSection(sectionId: string, user: User) {
    try {
      const section = await this.authorizeSection(sectionId, user.id);
      await this.prisma.section.delete({
        where: {
          id: section.id,
        },
      });
      return {
        message: CV_STORAGE_MESSAGES.SECTION_DELETED,
      };
    } catch (error) {
      this.handleSectionError(error);
    }
  }

  async createContentSection(dto: ContentSectionDTO, user: User) {
    try {
      const section = await this.authorizeSection(dto.sectionId, user.id);
      const { sectionId, detail, standard, tag } = dto;
      const { type } = section;

      if (
        ['detail', 'standard'].includes(type.toLowerCase()) &&
        (detail || standard)
      ) {
        const lastRecord: Detail | Standard = await this.prisma[
          type.toLowerCase()
        ].findFirst({
          where: {
            sectionId,
          },
          orderBy: {
            order: 'desc',
          },
        });
        let orderIndex = 1024;
        if (lastRecord) orderIndex += lastRecord.order;
        const data = type === CVSection.DETAIL ? detail : standard;
        await this.prisma[type.toLowerCase()].create({
          data: {
            sectionId,
            ...data,
            order: data.order ? data.order : orderIndex,
          },
        });
      }
      if (type === CVSection.TAG && tag) {
        await this.prisma.section.update({
          where: {
            id: dto.sectionId,
          },
          data: {
            tags: tag,
          },
        });
      }

      return {
        message: CV_STORAGE_MESSAGES.SECTION_CONTENT_CREATED,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async updateContentSection(
    contentId: string,
    dto: ContentSectionDTO,
    user: User,
  ) {
    try {
      const section = await this.authorizeSection(dto.sectionId, user.id);
      const { detail, standard, tag } = dto;
      const { type } = section;

      if (
        ['detail', 'standard'].includes(type.toLowerCase()) &&
        (detail || standard)
      ) {
        const data = type === CVSection.DETAIL ? detail : standard;
        await this.prisma[type.toLowerCase()].update({
          where: {
            id: contentId,
          },
          data: {
            ...data,
          },
        });
      }
      if (type === CVSection.TAG && tag) {
        await this.prisma.section.update({
          where: {
            id: dto.sectionId,
          },
          data: {
            tags: tag,
          },
        });
      }

      return {
        message: CV_STORAGE_MESSAGES.SECTION_CONTENT_UPDATED,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async deleteContentSection(
    contentId: string,
    dto: DeleteContentSectionDTO,
    user: User,
  ) {
    try {
      const section = await this.authorizeSection(dto.sectionId, user.id);
      const { type } = section;

      if (['detail', 'standard'].includes(type.toLowerCase())) {
        await this.prisma[type.toLowerCase()].delete({
          where: {
            id: contentId,
          },
        });
      }
      if (type === CVSection.TAG) {
        await this.prisma.section.update({
          where: {
            id: dto.sectionId,
          },
          data: {
            tags: [],
          },
        });
      }
      return {
        message: CV_STORAGE_MESSAGES.SECTION_CONTENT_DELETED,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async sortSection(dto: SortSectionDTO, user: User) {
    try {
      const { cVStorageId, sectionId, prev, next } = dto;

      if (prev === undefined && next === undefined)
        throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
      await this.authorizeCvStorage(cVStorageId, user);

      let currentIndex: number;
      if (prev === undefined) {
        currentIndex = next - 512;
      } else if (next === undefined) {
        currentIndex = prev + 512;
      } else {
        currentIndex = Math.floor((prev + next) / 2);
      }
      await this.prisma.section.update({
        where: {
          id: sectionId,
        },
        data: {
          order: currentIndex,
        },
      });

      if (
        Math.abs(currentIndex - prev) <= 1 ||
        Math.abs(currentIndex - next) <= 1
      ) {
        const sections = await this.prisma.section.findMany({
          where: {
            cVStorageId,
          },
          orderBy: {
            order: 'asc',
          },
        });
        await Promise.all(
          sections.map(async (element, index) => {
            await this.prisma.section.update({
              where: {
                id: element.id,
              },
              data: {
                order: (index + 1) * 1024,
              },
            });
          }),
        );
      }
      return {
        message: CV_STORAGE_MESSAGES.SECTION_SORT_SUCCESS,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async sortSectionContent(dto: SortSectionContentDTO, user: User) {
    try {
      const { contentId, sectionId, prev, next } = dto;

      if (prev === undefined && next === undefined)
        throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
      const section = await this.authorizeSection(sectionId, user.id);

      let currentIndex: number;
      if (prev === undefined) {
        currentIndex = next - 512;
      } else if (next === undefined) {
        currentIndex = prev + 512;
      } else {
        currentIndex = Math.floor((prev + next) / 2);
      }

      const type = section.type.toLowerCase();

      if (['detail', 'standard'].includes(type)) {
        await this.prisma[type].update({
          where: {
            id: contentId,
          },
          data: {
            order: currentIndex,
          },
        });
        if (
          Math.abs(currentIndex - prev) <= 1 ||
          Math.abs(currentIndex - next) <= 1
        ) {
          const contents = await this.prisma[type].findMany({
            where: {
              sectionId,
            },
            orderBy: {
              order: 'asc',
            },
          });
          await Promise.all(
            contents.map(async (element: Detail | Standard, index: number) => {
              await this.prisma[type].update({
                where: {
                  id: element.id,
                },
                data: {
                  order: (index + 1) * 1024,
                },
              });
            }),
          );
        }
      }

      return {
        message: CV_STORAGE_MESSAGES.SECTION_CONTENT_SORT_SUCCESS,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async updateThemeColor(cvStorageId: string, dto: ThemeDTO, user: User) {
    try {
      await this.authorizeCvStorage(cvStorageId, user);
      await this.prisma.cVStorage.update({
        where: {
          id: cvStorageId,
        },
        data: {
          theme: dto,
        },
      });
      return {
        message: CV_STORAGE_MESSAGES.CV_STORAGE_UPDATED,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async uploadAvatar(
    cvStorageId: string,
    file: Express.Multer.File,
    user: User,
  ) {
    try {
      await this.authorizeCvStorage(cvStorageId, user);
      const { url } = await this.cloud.uploadImage(file);
      await this.prisma.cVStorage.update({
        where: {
          id: cvStorageId,
        },
        data: {
          avatar: url,
        },
      });
      return {
        message: CV_STORAGE_MESSAGES.UPLOAD_SUCCESS,
        url,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async shareCV(cvStorageId: string, dto: ShareCvDTO, user: User) {
    try {
      await this.authorizeCvStorage(cvStorageId, user);
      await this.prisma.cVStorage.update({
        where: {
          id: cvStorageId,
        },
        data: {
          isPublic: dto.isPublic,
        },
      });
      return {
        message: CV_STORAGE_MESSAGES.CV_STORAGE_UPDATED,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  async changeTemplate(dto: ChangeTemplateDTO, user: User) {
    try {
      await this.authorizeCvStorage(dto.cvId, user);
      const template = await this.prisma.template.findUnique({
        where: {
          id: dto.templateId,
        },
      });
      const data = await this.prisma.cVStorage.update({
        where: {
          id: dto.cvId,
        },
        data: {
          templateId: dto.templateId,
          theme: template.theme,
        },
        select: CVStorageResponse,
      });
      return {
        data,
      };
    } catch (error) {
      this.handleCvStorageError(error);
    }
  }

  private async existInformation(user: User) {
    const cvInfo = await this.prisma.cVInformation.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        education: true,
        work: true,
      },
    });
    if (!cvInfo) {
      return await this.prisma.cVInformation.create({
        data: {
          userId: user.id,
          contact: {
            email: user.email,
          },
          about: {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
        include: {
          education: true,
          work: true,
        },
      });
    }
    return cvInfo;
  }

  private async authorizeSection(sectionId: string, userId: string) {
    const section = await this.prisma.section.findUniqueOrThrow({
      where: {
        id: sectionId,
      },
      include: {
        CVStorage: true,
      },
    });
    if (section.CVStorage.userId !== userId)
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    return section;
  }

  private async authorizeCvStorage(cvStorageId: string, user: User) {
    const cvStorage = await this.prisma.cVStorage.findUniqueOrThrow({
      where: {
        id: cvStorageId,
      },
      select: {
        ...CVStorageResponse,
        userId: true,
      },
    });
    if (cvStorage.userId !== user.id)
      throw new UnauthorizedException(AUTH_MESSAGES.UNAUTHORIZED);
    return cvStorage;
  }

  private handleSectionError(error: any) {
    if (error instanceof PrismaClientKnownRequestError)
      if (error.code === 'P2025')
        throw new NotFoundException(CV_STORAGE_MESSAGES.SECTION_NOT_FOUND);
    if (error instanceof UnauthorizedException) throw error;
    throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
  }

  private handleCvStorageError(error: any) {
    if (error instanceof PrismaClientKnownRequestError)
      if (error.code === 'P2025')
        throw new NotFoundException(CV_STORAGE_MESSAGES.CV_STORAGE_NOT_FOUND);
    if (error instanceof UnauthorizedException) throw error;
    throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
  }
}
