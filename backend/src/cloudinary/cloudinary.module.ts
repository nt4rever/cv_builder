import { CloudinaryProvider } from './cloudinary.provider';
import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Global()
@Module({
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
