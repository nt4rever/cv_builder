import { AUTH_MESSAGES } from './../../utils/messages/auth.message';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-custom';
import { Auth, google } from 'googleapis';
import { Request } from 'express';
import { User } from '@prisma/client';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  'google-oauth-token',
) {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super();
    const clientID = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const clientSecret = this.configService.get('GOOGLE_AUTH_CLIENT_SECRET');
    this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
  }

  async validate(req: Request): Promise<User> {
    try {
      const token: string = req
        .get('Authorization')
        .replace('Bearer', '')
        .trim();
      if (!token) {
        throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
      }
      const tokenInfo = await this.oauthClient.getTokenInfo(token);
      const user = await this.prisma.user.findFirst({
        where: {
          email: tokenInfo.email,
        },
      });
      if (!user) {
        const userData = await this.getUserData(token);
        const newUser = await this.prisma.user.create({
          data: {
            email: userData.email,
            firstName: userData.family_name,
            lastName: userData.given_name,
            googleProvider: {
              id: userData.id,
              token: token,
            },
          },
        });
        return newUser;
      }
      return user;
    } catch (error) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN);
    }
  }

  async getUserData(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({
      access_token: token,
    });
    const userInfoResponse = await userInfoClient.get({
      auth: this.oauthClient,
    });
    return userInfoResponse.data;
  }
}
