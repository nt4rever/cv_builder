import { MailerService } from '@nestjs-modules/mailer/dist';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private config: ConfigService,
  ) {}

  async sendResetPasswordEmail(user: User, token: string) {
    const BASE_URL = this.config.get<string>('API_URL');
    const url = `${BASE_URL}/auth/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password - CV Builder',
      template: './reset-password',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    });
  }

  async sendInvitationSignUp(user: User, token: string) {
    const BASE_URL = this.config.get<string>('API_URL');
    const url = `${BASE_URL}/auth/signup-confirmation?token=${token}`;
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Please click the link in the email to verify signup',
      template: './invitation',
      context: {
        name: `${user.firstName} ${user.lastName}`,
        url,
      },
    });
  }
}
