import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserMapper } from '@modules/user/infrastructure/persistence/mappers/user.mapper';
import {
  UserDocument,
  UserMongoEntity,
} from '@modules/user/infrastructure/persistence/schemas/user.mongo.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MongoRepositoryBase } from '@shared/infrastructure/persistence/mongo/mongo.repository.base';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class UserRepository
  extends MongoRepositoryBase<UserEntity, UserDocument, UserMongoEntity>
  implements UserRepositoryPort
{
  constructor(
    @InjectModel(UserMongoEntity.name) readonly userModel: Model<UserDocument>,
    readonly userMapper: UserMapper
  ) {
    super(userModel, userMapper);
  }

  async existsByEmail(email: string, session?: ClientSession): Promise<boolean> {
    const count = await this.userModel
      .countDocuments({ email }, { limit: 1 })
      .session(session ?? null);

    return count > 0;
  }
}
