import { Module } from '@nestjs/common';
import { PinoLoggerModule } from '@shared/infrastructure/logger/pino-logger.module';
import { HashModule } from '@shared/infrastructure/services/hash/hash.module';
import { TimeModule } from '@shared/infrastructure/services/time/time.module';

@Module({
  imports: [PinoLoggerModule, HashModule, TimeModule],
  exports: [PinoLoggerModule, HashModule, TimeModule],
})
export class SharedModule {}
