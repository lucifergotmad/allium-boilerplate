import { UserInternalDto } from '@modules/user/api/dtos/user.internal.dto';
import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { UserMongoEntity } from '@modules/user/infrastructure/persistence/schemas/user.mongo.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserReadModel {
  constructor(@InjectModel(UserMongoEntity.name) private userModel: Model<UserMongoEntity>) {}

  async findById(id: string): Promise<UserResponseDto | null> {
    const raw = await this.userModel.findById(id).lean().exec();
    if (!raw) return null;

    return new UserResponseDto({
      id: raw._id,
      email: raw.email,
      firstName: raw.first_name,
      lastName: raw.last_name,
      role: raw.role,
      createdAt: raw.created_at.toISOString(),
      updatedAt: raw.updated_at.toISOString(),
    });
  }

  async findAll(page: number, limit: number): Promise<UserResponseDto[]> {
    const skip = (page - 1) * limit;

    const docs = await this.userModel
      .find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();

    return docs.map(
      (doc) =>
        new UserResponseDto({
          id: doc._id,
          email: doc.email,

          firstName: doc.first_name,
          lastName: doc.last_name,

          role: doc.role,
          createdAt: doc.created_at.toISOString(),
          updatedAt: doc.updated_at.toISOString(),
        })
    );
  }

  async findInternalByEmail(email: string): Promise<UserInternalDto | null> {
    const raw = await this.userModel
      .findOne({ email })
      .select('+password +refresh_token')
      .lean()
      .exec();

    if (!raw) return null;
    if (!raw.password) return null;

    return {
      id: raw._id,
      email: raw.email,
      role: raw.role,
      passwordHashed: raw.password,
      refreshTokenHashed: raw.refresh_token,
    };
  }

  async countAll(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }
}
