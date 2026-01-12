import { ArgumentInvalidException } from '@shared/core/exceptions/common.exceptions';
import { ValueObject } from '@shared/domain/base-classes/value-object.base';

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);
    super({ value: date });
  }

  public getValue(): Date {
    return this.props.value;
  }

  public static now(): DateVO {
    return new DateVO(Date.now());
  }

  public toISOString(): string {
    return this.props.value.toISOString();
  }

  protected validate({ value }: { value: Date }): void {
    if (Number.isNaN(value.getTime())) {
      throw new ArgumentInvalidException('Invalid date format');
    }
  }
}
