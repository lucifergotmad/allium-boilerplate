import { Provider } from '@nestjs/common';
import { TimeServicePort } from '@shared/domain/ports/time.service.port';
import { TimeService } from '@shared/infrastructure/services/time/time.service';

export const timeProvider: Provider = {
  provide: TimeServicePort,
  useClass: TimeService,
};
