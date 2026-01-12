import { ArgumentInvalidException } from '@shared/core/exceptions/common.exceptions';
import { DomainPrimitive, ValueObject } from '@shared/domain/base-classes/value-object.base';

export class EmailVO extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  public getRaw(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(value)) {
      throw new ArgumentInvalidException('Invalid email format');
    }
  }

  static create(email: string): EmailVO {
    const sanitized = email.trim().toLowerCase();
    return new EmailVO(sanitized);
  }
}
