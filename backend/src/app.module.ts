import { TemplateModule } from './template/template.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { MailModule } from './mail/mail.module';
import { InformationModule } from './information/information.module';
import { CvstorageModule } from './cvstorage/cvstorage.module';
import { ShareModule } from './share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CloudinaryModule,
    TemplateModule,
    MailModule,
    InformationModule,
    CvstorageModule,
    ShareModule,
  ],
})
export class AppModule {}
