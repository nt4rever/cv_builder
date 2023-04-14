import { Module } from '@nestjs/common';
import { CvstorageController } from './cvstorage.controller';
import { CvstorageService } from './cvstorage.service';

@Module({
  controllers: [CvstorageController],
  providers: [CvstorageService],
})
export class CvstorageModule {}
