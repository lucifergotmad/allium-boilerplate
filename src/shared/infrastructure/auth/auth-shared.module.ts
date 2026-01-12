import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@shared/infrastructure/auth/strategies/jwt-auth.strategy';
import { EnvModule } from '@shared/infrastructure/config/env.module';
import { EnvService } from '@shared/infrastructure/config/env.service';

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-auth' }),
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        secret: envService.jwtAccessKey,
        signOptions: {
          expiresIn: envService.jwtAccessLimit,
        },
      }),
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthSharedModule {}
