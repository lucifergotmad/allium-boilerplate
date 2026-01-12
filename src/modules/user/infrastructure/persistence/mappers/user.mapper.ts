import { Injectable } from '@nestjs/common';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { UserMongoEntity } from '@modules/user/infrastructure/persistence/schemas/user.mongo.schema';
import { BaseMapper } from '@shared/infrastructure/persistence/mappers/mapper.base';
import { UserRole } from '@modules/user/domain/types/user.role.enum';
import { DateVO } from '@shared/domain/value-objects/date.value-object';
import { EmailVO } from '@shared/domain/value-objects/email.value-object';

@Injectable()
export class UserMapper extends BaseMapper<UserEntity, UserMongoEntity> {
  toPersistence(entity: UserEntity): UserMongoEntity {
    const props = entity.getProps();
    const record = new UserMongoEntity();

    record._id = entity.id;
    record.email = props.email.value;
    record.password = props.password;
    record.first_name = props.firstName;
    record.last_name = props.lastName;
    record.role = props.role;
    record.refresh_token = props.refreshToken;

    record.created_at = entity.createdAt.value;
    record.updated_at = entity.updatedAt.value;

    return record;
  }

  toDomain(record: UserMongoEntity): UserEntity {
    return new UserEntity({
      _id: record._id,
      createdAt: new DateVO(record.created_at),
      updatedAt: new DateVO(record.updated_at),
      props: {
        email: new EmailVO(record.email),
        password: record.password,
        firstName: record.first_name,
        lastName: record.last_name,
        role: record.role as UserRole,
        refreshToken: record.refresh_token,
      },
    });
  }
}
