import { UserReadModel } from '@modules/user/infrastructure/persistence/read-models/user.read-model.service';
import { Inject, Provider } from '@nestjs/common';

export const InjectUserReadModel = Inject(UserReadModel.name);
export const userReadModelProvider: Provider = {
  provide: UserReadModel.name,
  useClass: UserReadModel,
};
