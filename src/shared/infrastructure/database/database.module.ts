import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvModule } from '@shared/infrastructure/config/env.module';
import { EnvService } from '@shared/infrastructure/config/env.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        uri: envService.dbConnectionUri,
      }),
    }),
  ],
})
export class DatabaseModule {}
