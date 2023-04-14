import { AuthGuard } from '@nestjs/passport';

export class GoogleGuard extends AuthGuard('google-oauth-token') {}
