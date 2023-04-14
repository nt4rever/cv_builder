import { PassportStrategy } from '@nestjs/passport';
import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { User } from '@prisma/client';

@Injectable()
export class FacebookStrategy extends PassportStrategy(
  FacebookTokenStrategy,
  'facebook-token',
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      clientID: config.get<string>('META_AUTH_APP_ID'),
      clientSecret: config.get<string>('META_AUTH_APP_SECRET'),
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: FacebookTokenStrategy.Profile,
    done: (err: any, user: User, info?: any) => void,
  ): Promise<void> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [
            {
              facebookProvider: {
                is: {
                  id: profile.id,
                },
              },
            },
            {
              email: profile?.emails[0]?.value,
            },
          ],
        },
      });

      if (!user) {
        if (!profile.emails[0].value) return done('error', null);
        const newUser = await this.prisma.user.create({
          data: {
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value,
            facebookProvider: {
              id: profile.id,
              token: accessToken,
            },
          },
        });
        return done(null, newUser);
      }
      return done(null, user);
    } catch (error) {
      return done('error', null);
    }
  }
}
