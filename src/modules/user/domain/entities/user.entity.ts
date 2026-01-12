import { UserCreatedEvent } from '@modules/user/domain/events/user-created.event';
import { CreateUserProps, UpdateUserProps, UserProps } from '@modules/user/domain/types/user.type';
import { AggregateRoot } from '@shared/domain/base-classes/aggregate-root.base';
import { EmailVO } from '@shared/domain/value-objects/email.value-object';

export class UserEntity extends AggregateRoot<UserProps> {
  static create(props: CreateUserProps): UserEntity {
    const user = new UserEntity({
      props: {
        email: new EmailVO(props.email),
        password: props.password,
        firstName: props.firstName,
        lastName: props.lastName,
        role: props.role,
        refreshToken: props.refreshToken,
      },
    });

    user.addDomainEvent(new UserCreatedEvent({ userId: user.id, email: user.email.value }));

    return user;
  }

  get email(): EmailVO {
    return this.props.email;
  }

  get password(): string | undefined {
    return this.props.password;
  }

  get role(): string {
    return this.props.role;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string | undefined {
    return this.props.lastName;
  }

  get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  updateProfile(props: Partial<UpdateUserProps>) {
    if (props.firstName) this.props.firstName = props.firstName;
    if (props.lastName) this.props.lastName = props.lastName;

    this.update();
  }

  updateRefreshToken(refreshToken: string) {
    this.props.refreshToken = refreshToken;
  }

  protected validateInvariants(): void {}
}
