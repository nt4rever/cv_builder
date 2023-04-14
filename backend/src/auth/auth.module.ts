import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt/dist';
import {
  FacebookStrategy,
  GoogleStrategy,
  JwtStrategy,
  RefreshTokenStrategy,
} from './strategy';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    FacebookStrategy,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
