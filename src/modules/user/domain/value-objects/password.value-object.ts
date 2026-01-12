import { PASSWORD_REGEX } from '@shared/core/constants/regex/regex.const';
import { ArgumentInvalidException } from '@shared/core/exceptions/common.exceptions';
import { DomainPrimitive, ValueObject } from '@shared/domain/base-classes/value-object.base';

export class PasswordVO extends ValueObject<string> {
  constructor(value: string) {
    super({ value });
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!PASSWORD_REGEX.test(value)) {
      throw new ArgumentInvalidException(
        'Password must be at least 8 characters, contain 1 uppercase, 1 lowercase, and 1 number'
      );
    }
  }
}
