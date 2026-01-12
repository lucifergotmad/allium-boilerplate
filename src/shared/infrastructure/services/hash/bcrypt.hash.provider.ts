import { Provider } from '@nestjs/common';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';
import { BcryptHashService } from '@shared/infrastructure/services/hash/bcrypt.hash.service';

export const hashServiceProvider: Provider = {
  provide: HashServicePort,
  useClass: BcryptHashService,
};
