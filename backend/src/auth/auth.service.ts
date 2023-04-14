import { MailService } from './../mail/mail.service';
import { PrismaService } from './../prisma/prisma.service';
import { User } from '@prisma/client';
import { AUTH_MESSAGES } from './../utils/messages';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { AuthDTO, SignUpDTO, UpdateDTO } from './dto';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { generateConfirmToken, generateToken } from './../utils/generate-token';
import {
  decryptToken,
  getUserUUIDFromToken,
  validateConfirmToken,
  validateResetToken,
} from './../utils/validate-token';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) {}

  async signup(dto: SignUpDTO) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          ...dto,
          password: hash,
          isActive: false,
        },
      });

      const token = generateConfirmToken(user);
      this.mailService.sendInvitationSignUp(user, encodeURIComponent(token));
      return {
        message: AUTH_MESSAGES.EMAIL_VERIFICATION_SENT,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        if (error.code === 'P2002')
          throw new ForbiddenException(AUTH_MESSAGES.EMAIL_ALREADY_EXISTS);
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async signin({ email, password }: AuthDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
      if (!user.isActive)
        throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_LOCKED);
      if (!user.password)
        throw new ForbiddenException(AUTH_MESSAGES.IS_SOCIAL_ACCOUNT);
      const pwMatches = await argon.verify(user.password, password);
      if (!pwMatches)
        throw new ForbiddenException(AUTH_MESSAGES.INVALID_CREDENTIALS);

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        user: this.clearDataUser(user),
      };
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof UnauthorizedException
      )
        throw error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async logout(userId: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          refreshToken: null,
        },
      });
      return {
        message: AUTH_MESSAGES.LOGOUT_SUCCESS,
      };
    } catch (error) {
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async social(userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_FOUND);
      if (!user.isActive)
        throw new ForbiddenException(AUTH_MESSAGES.ACCOUNT_LOCKED);
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        user: this.clearDataUser(user),
      };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async updateInfo(userId: string, dto: UpdateDTO) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      const { newPassword, oldPassword, ...updateData } = dto;

      if (newPassword) {
        if (user.password) {
          if (oldPassword === newPassword)
            throw new ForbiddenException(AUTH_MESSAGES.INVALID_CREDENTIALS);
          const pwMatches = await argon.verify(user.password, oldPassword);
          if (!pwMatches)
            throw new ForbiddenException(AUTH_MESSAGES.INVALID_CREDENTIALS);
        }

        const hash = await argon.hash(newPassword);
        const updateUser = await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hash,
            ...updateData,
          },
        });
        return this.clearDataUser(updateUser);
      }

      const updateUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          ...updateData,
        },
      });

      return this.clearDataUser(updateUser);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async refreshTokens(userId: string, refreshToken: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user || !user.refreshToken)
        throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_FOUND);
      const refreshTokenMatches = await argon.verify(
        user.refreshToken,
        refreshToken,
      );

      if (!refreshTokenMatches)
        throw new ForbiddenException(AUTH_MESSAGES.INVALID_TOKEN);
      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshToken(user.id, tokens.refreshToken);
      return {
        message: AUTH_MESSAGES.REFRESH_TOKEN_GENERATED,
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async requestResetPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) throw new ForbiddenException(AUTH_MESSAGES.USER_NOT_FOUND);
      const token = generateToken(user);
      this.mailService.sendResetPasswordEmail(user, encodeURIComponent(token));
      return {
        message: AUTH_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const decryptedToken = decryptToken(decodeURIComponent(token));
      if (!decryptedToken)
        throw new BadRequestException(AUTH_MESSAGES.INVALID_TOKEN);

      const userUUID = getUserUUIDFromToken(decryptedToken);
      if (!userUUID) throw new BadRequestException(AUTH_MESSAGES.INVALID_TOKEN);

      const user = await this.prisma.user.findUnique({
        where: { id: userUUID },
      });
      if (!user) return new BadRequestException(AUTH_MESSAGES.USER_NOT_FOUND);

      const isTokenValid = await validateResetToken(user, decryptedToken);
      if (!isTokenValid)
        throw new BadRequestException(AUTH_MESSAGES.INVALID_TOKEN);

      const hash = await argon.hash(newPassword);
      const updateUser = await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: hash,
          isActive: true,
        },
      });
      const BASE_URL = this.config.get<string>('APP_URL');
      const url = `${BASE_URL}/login`;
      return {
        message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS,
        user: this.clearDataUser(updateUser),
        url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async signUpConfirmation(token: string) {
    try {
      const decryptedToken = decryptToken(decodeURIComponent(token));

      if (!decryptedToken)
        throw new BadRequestException(AUTH_MESSAGES.INVALID_TOKEN);

      const userUUID = getUserUUIDFromToken(decryptedToken);

      if (!userUUID) throw new BadRequestException(AUTH_MESSAGES.INVALID_TOKEN);

      const user = await this.prisma.user.findUnique({
        where: { id: userUUID },
      });
      if (!user) throw new BadRequestException(AUTH_MESSAGES.USER_NOT_FOUND);

      const isTokenValid = await validateConfirmToken(user, decryptedToken);
      if (!isTokenValid)
        throw new BadRequestException(AUTH_MESSAGES.INVALID_TOKEN);
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          isActive: true,
        },
      });
      const BASE_URL = this.config.get<string>('APP_URL');
      const url = `${BASE_URL}/login`;
      return {
        message: AUTH_MESSAGES.ACCOUNT_VERIFIED,
        url,
      };
    } catch (error) {
      if (error instanceof BadRequestException) return error;
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  async deleteAccount(user: User) {
    try {
      const cvInfo = await this.prisma.cVInformation.findMany({
        where: {
          userId: user.id,
        },
      });
      const cvIds = cvInfo.map((cv) => cv.id);
      await this.prisma.$transaction([
        this.prisma.work.deleteMany({
          where: {
            cVInformationId: {
              in: cvIds,
            },
          },
        }),
        this.prisma.education.deleteMany({
          where: {
            cVInformationId: {
              in: cvIds,
            },
          },
        }),
      ]);
      await this.prisma.cVInformation.deleteMany({
        where: {
          userId: user.id,
        },
      });
      await this.prisma.user.delete({
        where: {
          id: user.id,
        },
      });
      return {
        message: AUTH_MESSAGES.ACCOUNT_DELETED,
      };
    } catch (error) {
      throw new ForbiddenException(AUTH_MESSAGES.ERROR);
    }
  }

  private async updateRefreshToken(userId: string, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hash,
      },
    });
  }

  private async getTokens(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('ACCESS_TOKEN_EXPIRE'),
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('REFRESH_TOKEN_EXPIRE'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private clearDataUser(user: User) {
    delete user.facebookProvider;
    delete user.googleProvider;
    delete user.password;
    delete user.refreshToken;
    return user;
  }
}
