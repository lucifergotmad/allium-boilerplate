import { AuthModule } from '@modules/auth/auth.module';
import { CoreModule } from '@modules/core.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthSharedModule } from '@shared/infrastructure/auth/auth-shared.module';
import { EnvModule } from '@shared/infrastructure/config/env.module';
import { validate } from '@shared/infrastructure/config/env.validation';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { SharedModule } from '@shared/shared.module';
import { AppController } from 'src/app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validate, envFilePath: '.env' }),
    EnvModule,
    AuthSharedModule,
    DatabaseModule,
    CoreModule,
    SharedModule,

    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
