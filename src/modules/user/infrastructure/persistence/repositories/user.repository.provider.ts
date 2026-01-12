import { UserRepository } from '@modules/user/infrastructure/persistence/repositories/user.repository.service';
import { Inject, Provider } from '@nestjs/common';

export const InjectUserRepository = Inject(UserRepository.name);
export const userRepositoryProvider: Provider = {
  provide: UserRepository.name,
  useClass: UserRepository,
};
