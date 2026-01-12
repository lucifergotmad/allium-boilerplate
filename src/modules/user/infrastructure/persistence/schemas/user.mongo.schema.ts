import { UserRole } from '@modules/user/domain/types/user.role.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoEntity } from '@shared/infrastructure/persistence/mongo-entity.base';
import { HydratedDocument } from 'mongoose';

@Schema({
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  autoIndex: true,
})
export class UserMongoEntity extends BaseMongoEntity<UserMongoEntity> {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ select: false })
  password?: string;

  @Prop({ required: true })
  first_name: string;

  @Prop()
  last_name?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: string;

  @Prop({ select: false })
  refresh_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(UserMongoEntity);
export const UserModel = [{ name: UserMongoEntity.name, schema: UserSchema }];

export type UserDocument = HydratedDocument<UserMongoEntity>;
