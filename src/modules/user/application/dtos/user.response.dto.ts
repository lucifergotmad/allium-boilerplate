import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  readonly id: string;

  @Expose()
  readonly email: string;

  @Expose()
  readonly firstName: string;

  @Expose()
  readonly lastName?: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Expose()
  readonly role: string;

  @Expose()
  readonly createdAt: string;

  @Expose()
  readonly updatedAt: string;

  constructor(props: Partial<UserResponseDto>) {
    Object.assign(this, props);
  }

  static fromEntity(entity: UserEntity): UserResponseDto {
    const props = entity.getProps();
    return new UserResponseDto({
      id: entity.id,
      email: props.email.value,
      firstName: props.firstName,
      lastName: props.lastName,
      role: props.role,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    });
  }
}
