import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { GetUser } from './decorator';
import {
  AuthDTO,
  ResetPasswordDTO,
  ResetPasswordRequestDTO,
  SignUpDTO,
  UpdateDTO,
} from './dto';
import {
  FacebookGuard,
  GoogleGuard,
  JwtGuard,
  RefreshTokenGuard,
} from './guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() dto: SignUpDTO) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signin(@Body() dto: AuthDTO) {
    return this.authService.signin(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Get('logout')
  @ApiOperation({
    summary: 'logout (remove refresh_token in database, require access_token)',
  })
  logout(@GetUser('id') userId: string) {
    return this.authService.logout(userId);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'update info user',
  })
  @ApiBearerAuth()
  @Post('update')
  update(@Body() dto: UpdateDTO, @GetUser('id') userId: string) {
    return this.authService.updateInfo(userId, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'get current user profile (require access_token)',
  })
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @ApiBearerAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'require refresh token',
  })
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(FacebookGuard)
  @ApiOperation({
    summary: 'require token facebook',
  })
  @Post('facebook')
  facebookHandle(@Req() req: Request) {
    const userId = req.user['id'];
    return this.authService.social(userId);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  @ApiOperation({
    summary: 'require token google',
  })
  @Post('google')
  googleHandle(@Req() req: Request) {
    const userId = req.user['id'];
    return this.authService.social(userId);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'request reset password with email',
  })
  @Post('reset-password')
  requestResetPassword(@Body() dto: ResetPasswordRequestDTO) {
    return this.authService.requestResetPassword(dto.email);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'change password',
  })
  @Post('reset-password-handle')
  resetPassword(@Body() dto: ResetPasswordDTO) {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Get('reset-password')
  @Render('reset-password')
  resetPasswordPage() {
    return {};
  }

  @Get('reset-password-error')
  @Render('reset-password-error')
  resetPasswordErrorPage() {
    return { url: process.env.APP_URL };
  }

  @Get('signup-confirmation')
  @Redirect(process.env.APP_URL, 302)
  signUpConfirmation(@Query('token') token: string) {
    return this.authService.signUpConfirmation(token);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete('delete')
  @ApiOperation({
    summary: 'delete current account',
  })
  deleteAccount(@GetUser() user: User) {
    return this.authService.deleteAccount(user);
  }
}
