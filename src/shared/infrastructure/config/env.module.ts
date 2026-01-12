import { Global, Module } from '@nestjs/common';
import { EnvService } from '@shared/infrastructure/config/env.service';

@Global()
@Module({
  imports: [],
  providers: [EnvService],
  exports: [EnvService],
})
export class EnvModule {}
