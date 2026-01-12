import { ArgumentInvalidException } from '@shared/core/exceptions/common.exceptions';

export type Primitives = string | number | boolean | Date;

export interface DomainPrimitive<T extends Primitives | object> {
  value: T;
}

export abstract class ValueObject<T extends Primitives | object> {
  protected readonly props: DomainPrimitive<T>;

  constructor(props: DomainPrimitive<T>) {
    this.checkIfEmpty(props);
    this.validate(props);
    this.props = props;
  }

  protected abstract validate(props: DomainPrimitive<T>): void;

  public get value(): T {
    return this.props.value;
  }

  private checkIfEmpty(props: DomainPrimitive<T>): void {
    if (
      props === null ||
      props === undefined ||
      props.value === null ||
      props.value === undefined
    ) {
      throw new ArgumentInvalidException('Value cannot be empty');
    }
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
