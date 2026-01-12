import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { EnvService } from '@shared/infrastructure/config/env.service';
import { Public } from '@shared/infrastructure/decorators/public.decorator';
import * as packageJson from 'package.json';

@Controller({ path: 'info', version: VERSION_NEUTRAL })
export class AppController {
  constructor(private readonly envService: EnvService) {}

  @Public()
  @Get()
  getAppInfo() {
    return {
      appName: 'Allium Boilerplate',
      description: packageJson.description,
      author: packageJson.author,
      version: packageJson.version,
      mode: this.envService.mode,
    };
  }
}
