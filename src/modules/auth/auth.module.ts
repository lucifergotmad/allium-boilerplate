import { LoginHandler } from '@modules/auth/application/commands/login/login.handler';
import { RefreshTokenHandler } from '@modules/auth/application/commands/refresh-token/refresh-token.handler';
import { RegisterHandler } from '@modules/auth/application/commands/register/register.handler';
import { AuthTokenPolicyService } from '@modules/auth/domain/services/auth-token.policy.service';
import { AuthController } from '@modules/auth/infrastructure/controllers/auth.controller';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [CqrsModule, UserModule, SharedModule],
  controllers: [AuthController],
  providers: [AuthTokenPolicyService, RegisterHandler, LoginHandler, RefreshTokenHandler],
})
export class AuthModule {}
