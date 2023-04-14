import { FOLDER_CLOUDINARY_PATH } from './../config';
import { CLOUD_MESSAGE } from './../utils/messages';
import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(
    filename: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    if (filename.size > 1000000) {
      throw new Error(CLOUD_MESSAGE.MAX_SIZE_ERROR);
    }

    if (!filename.mimetype.startsWith('image')) {
      throw new Error(CLOUD_MESSAGE.IS_IMAGE_ERROR);
    }

    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: FOLDER_CLOUDINARY_PATH,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(filename.buffer).pipe(upload);
    });
  }

  async uploadBufferImage(
    buffer: Buffer,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: FOLDER_CLOUDINARY_PATH,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      toStream(buffer).pipe(upload);
    });
  }
}
