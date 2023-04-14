import { CloudinaryService } from './../cloudinary/cloudinary.service';
import { CVStorageResponse } from './../utils/types/index';
import { PrismaService } from './../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { CV_STORAGE_MESSAGES } from '../utils/messages';
import puppeteer from 'puppeteer';
import { ExportDTO, ThumbnailDTO } from './dto';

@Injectable()
export class ShareService {
  constructor(
    private prisma: PrismaService,
    private cloud: CloudinaryService,
  ) {}

  async getCV(cvStorageId: string, req: Request) {
    try {
      const cv = await this.prisma.cVStorage.findUnique({
        where: {
          id: cvStorageId,
        },
        select: { ...CVStorageResponse, userId: true },
      });
      if (!cv)
        return new NotFoundException(CV_STORAGE_MESSAGES.CV_STORAGE_NOT_FOUND);
      if (cv.isPublic) return { data: cv };
      const token = req.get('Authorization').replace('Bearer', '').trim();
      if (!token)
        return new NotFoundException(CV_STORAGE_MESSAGES.CV_STORAGE_NOT_FOUND);
      const payload = await this.verifyToken(token);
      if (payload.email) {
        const user = await this.prisma.user.findUnique({
          where: {
            email: payload.email,
          },
        });
        if (user && user.id === cv.userId)
          return {
            data: cv,
          };
      }
      throw new NotFoundException(CV_STORAGE_MESSAGES.CV_STORAGE_NOT_FOUND);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new NotFoundException(CV_STORAGE_MESSAGES.CV_STORAGE_NOT_FOUND);
    }
  }

  async exportPDF(dto: ExportDTO) {
    try {
      const pdf = await this.printPDF(dto.cvUrl);
      return new StreamableFile(pdf);
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async exportPNG(dto: ExportDTO) {
    try {
      const png = await this.printPNG(dto.cvUrl);
      return new StreamableFile(png);
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  async saveThumbnail(dto: ThumbnailDTO) {
    try {
      const thumbnail = await this.printPNG(dto.cvUrl);
      const response = await this.cloud.uploadBufferImage(thumbnail);
      await this.prisma.cVStorage.update({
        where: {
          id: dto.cvStorageId,
        },
        data: {
          urlImage: response.url,
        },
      });
      return {
        message: CV_STORAGE_MESSAGES.CV_STORAGE_UPDATED,
      };
    } catch (error) {
      throw new ForbiddenException(CV_STORAGE_MESSAGES.ERROR);
    }
  }

  private async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, process.env.JWT_SECRET);
  }

  async printPDF(cvUrl: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({
      width: 8.5 * 96,
      height: 11 * 96,
    });
    await page.goto(decodeURIComponent(cvUrl), {
      waitUntil: 'networkidle0',
    });
    const pdf = await page.pdf({ printBackground: true, scale: 0.6 });
    await browser.close();
    return pdf;
  }

  async printPNG(cvUrl: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({
      width: 1000,
      height: 1500,
    });
    await page.goto(decodeURIComponent(cvUrl), {
      waitUntil: 'networkidle0',
    });
    const png = await page.screenshot({
      type: 'png',
      omitBackground: true,
      fullPage: true,
    });
    await browser.close();
    return png;
  }
}
