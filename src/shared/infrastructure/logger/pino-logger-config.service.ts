import { Injectable } from '@nestjs/common';
import { Params } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import { EnvService } from '@shared/infrastructure/config/env.service';

interface PinoRequest extends IncomingMessage {
  id: string;
}

@Injectable()
export class PinoLoggerConfigService {
  constructor(private readonly envService: EnvService) {}

  createLoggerOptions(): Params {
    const isProduction = this.envService.mode === 'production';

    return {
      pinoHttp: {
        transport: isProduction
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                singleLine: true,
                colorize: true,
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },

        level: isProduction ? 'info' : 'debug',

        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers["x-signature"]',
            'req.body.password',
            'req.body.confirmPassword',
          ],
          censor: '***REDACTED***',
        },

        serializers: {
          req: (req: IncomingMessage) => ({
            id: (req as PinoRequest).id,
            method: req.method,
            url: req.url,
          }),
        },

        autoLogging: {
          ignore: (req: IncomingMessage) => {
            const url = req.url || ''; // Handle potential undefined url
            return url.includes('/health') || url.includes('/favicon.ico');
          },
        },
      },
    };
  }
}
