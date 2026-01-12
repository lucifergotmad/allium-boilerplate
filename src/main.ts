import { NestFactory, Reflector } from '@nestjs/core';
import * as fs from 'fs';
import { resolve } from 'path';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface';
import {
  ClassSerializerInterceptor,
  Logger,
  NestApplicationOptions,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { AppModule } from 'src/app.module';
import helmet from 'helmet';
import { ConfigService } from '@nestjs/config';
import { ResponseTransformInterceptor } from '@shared/infrastructure/interceptors/response-transform.interceptor';
import { TimeoutInterceptor } from '@shared/infrastructure/interceptors/timeout.interceptor';
import { GlobalExceptionFilter } from '@shared/infrastructure/filters/http-exception.filter';
import { Logger as PinoLogger } from 'nestjs-pino';

async function bootstrap() {
  const isSecure = process.env.SECURE === '1' || process.env.SECURE === 'true';
  const httpsOptions = generateSecureOption(isSecure);

  const appOptions: NestApplicationOptions = {
    bufferLogs: true,
    ...httpsOptions,
  };

  const app = await NestFactory.create(AppModule, appOptions);

  const configService = app.get(ConfigService);

  app.useLogger(app.get(PinoLogger));

  app.use(helmet());
  app.enableCors();

  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalInterceptors(new ResponseTransformInterceptor());
  app.useGlobalInterceptors(new TimeoutInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter());

  const mode = configService.getOrThrow<'development' | 'production' | 'test'>('MODE_API');

  const port = configService.get<number>('PORT') ?? 3000;
  const host = '0.0.0.0';

  await app.listen(port, host);
  const logger = new Logger('Allium Boilerplate');

  logger.log(`🚀 Application is running on: ${await app.getUrl()}`);
  logger.log(`🛡️ Secure Mode (HTTPS): ${isSecure ? 'Enabled' : 'Disabled'} | Mode API: ${mode}`);
}

/**
 *
 * @returns return HttpsOptions Object which is part parameter of NestApplicationOptions
 */
function generateSecureOption(secure: boolean): { httpsOptions?: HttpsOptions } {
  if (!secure) return {};

  try {
    const certPath = '/home/nodeapp/cert';

    const privateKey = fs.readFileSync(resolve(certPath, 'private.key'), 'utf-8');
    const certificate = fs.readFileSync(resolve(certPath, 'certificate.crt'), 'utf-8');
    const ca = fs.readFileSync(resolve(certPath, 'ca_bundle.crt'));

    return {
      httpsOptions: {
        key: privateKey,
        cert: certificate,
        ca,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    console.error('❌ Failed to load SSL certificates. Falling back to HTTP.', errorMessage);
    return {};
  }
}

bootstrap().catch((error) => {
  console.error('Error during bootstrap: ', error);
  process.exit(1);
});
