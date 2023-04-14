import { INFORMATION_MESSAGE } from './../utils/messages';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AboutDTO, ContactDTO, EducationDTO, WorkDTO } from './dto';

@Injectable()
export class InformationService {
  constructor(private prisma: PrismaService) {}

  async cVInformation(user: User) {
    try {
      const cv = await this.existInformation(user);
      const [work, education] = await this.prisma.$transaction([
        this.prisma.work.findMany({
          where: {
            cVInformationId: cv.id,
          },
        }),
        this.prisma.education.findMany({
          where: {
            cVInformationId: cv.id,
          },
        }),
      ]);
      return {
        information: cv,
        work,
        education,
      };
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async createWork(user: User, dto: WorkDTO) {
    try {
      const cv = await this.existInformation(user);
      const work = await this.prisma.work.create({
        data: {
          ...dto,
          cVInformationId: cv.id,
        },
      });
      return {
        message: INFORMATION_MESSAGE.CREATE_WORK_SUCCESS,
        work,
      };
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async updateWork(id: string, dto: WorkDTO) {
    try {
      return await this.prisma.work.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async deleteWork(id: string) {
    try {
      await this.prisma.work.delete({
        where: {
          id,
        },
      });
      return {
        message: INFORMATION_MESSAGE.DELETE_WORK_SUCCESS,
      };
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async updateEducation(id: string, dto: EducationDTO) {
    try {
      return await this.prisma.education.update({
        where: {
          id,
        },
        data: {
          ...dto,
        },
      });
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async createEducation(user: User, dto: EducationDTO) {
    try {
      const cv = await this.existInformation(user);
      const education = await this.prisma.education.create({
        data: {
          ...dto,
          cVInformationId: cv.id,
        },
      });
      return {
        message: INFORMATION_MESSAGE.CREATE_EDUCATION_SUCCESS,
        education,
      };
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async deleteEducation(id: string) {
    try {
      await this.prisma.education.delete({
        where: {
          id,
        },
      });
      return {
        message: INFORMATION_MESSAGE.DELETE_EDUCATION_SUCCESS,
      };
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async about(user: User, dto: AboutDTO) {
    try {
      const cv = await this.existInformation(user);
      return await this.prisma.cVInformation.update({
        where: {
          id: cv.id,
        },
        data: {
          about: {
            ...cv.about,
            ...dto,
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  async contact(user: User, dto: ContactDTO) {
    try {
      const cv = await this.existInformation(user);
      return await this.prisma.cVInformation.update({
        where: {
          id: cv.id,
        },
        data: {
          contact: {
            ...cv.contact,
            ...dto,
          },
        },
      });
    } catch (error) {
      throw new ForbiddenException(INFORMATION_MESSAGE.ERROR);
    }
  }

  private async existInformation(user: User) {
    const cvInfo = await this.prisma.cVInformation.findFirst({
      where: {
        userId: user.id,
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
      });
    }
    return cvInfo;
  }
}
