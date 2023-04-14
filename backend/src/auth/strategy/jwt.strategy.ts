import { AUTH_MESSAGES } from './../../utils/messages/auth.message';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from './../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    if (!user) throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_FOUND);
    delete user.password;
    delete user.refreshToken;
    delete user.googleProvider;
    delete user.facebookProvider;
    return user;
  }
}
