import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { EnvModule } from '../config/env.module';
import { PinoLoggerConfigService } from './pino-logger-config.service';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [EnvModule],
      providers: [PinoLoggerConfigService],
      inject: [PinoLoggerConfigService],
      useFactory: (configService: PinoLoggerConfigService) => {
        const config = configService.createLoggerOptions();

        return {
          ...config,
          forRoutes: [{ path: '(.*)', method: RequestMethod.ALL }],
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class PinoLoggerModule {}
