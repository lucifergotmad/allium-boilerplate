import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel } from '@modules/user/infrastructure/persistence/schemas/user.mongo.schema';
import { userRepositoryProvider } from '@modules/user/infrastructure/persistence/repositories/user.repository.provider';
import { UserMapper } from '@modules/user/infrastructure/persistence/mappers/user.mapper';
import { userReadModelProvider } from '@modules/user/infrastructure/persistence/read-models/user.read-model.provider';
import { UserReadModel } from '@modules/user/infrastructure/persistence/read-models/user.read-model.service';

@Module({
  imports: [MongooseModule.forFeature(UserModel)],
  providers: [UserMapper, UserReadModel, userRepositoryProvider, userReadModelProvider],
  exports: [UserMapper, UserReadModel, userRepositoryProvider, userReadModelProvider],
})
export class UserPersistenceModule {}
