import { ArgumentInvalidException } from '@shared/core/exceptions/common.exceptions';
import { Guard } from '@shared/core/guards/guard';
import { UUID } from '@shared/core/utils/uuid.util';
import { AuditableProps } from '@shared/domain/types/auditable.type';
import { DateVO } from '@shared/domain/value-objects/date.value-object';

export type EntityProps<T> = {
  _id?: string;
  props: T;
} & AuditableProps;

export abstract class Entity<T> {
  private readonly _id: string;
  private readonly _createdAt: DateVO;
  private _updatedAt: DateVO;
  private _deletedAt?: DateVO;
  protected readonly props: T;

  constructor({ _id, createdAt, updatedAt, deletedAt, props }: EntityProps<T>) {
    this._id = _id ? _id : UUID.generate();
    this.props = props;

    const now = DateVO.now();

    this._createdAt = createdAt ? createdAt : now;
    this._updatedAt = updatedAt ? updatedAt : now;
    this._deletedAt = deletedAt;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): DateVO {
    return this._createdAt;
  }

  get updatedAt(): DateVO {
    return this._updatedAt;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!Guard.isEntity(object)) {
      return false;
    }

    return this._id === object._id;
  }

  public getProps(): T & AuditableProps & { id: string } {
    const propsCopy = {
      id: this._id,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
      ...this.props,
    };
    return Object.freeze(propsCopy);
  }

  protected update(): void {
    this._updatedAt = DateVO.now();
  }

  protected delete(): void {
    this._deletedAt = DateVO.now();
  }

  public validate(): void {
    if (Guard.isEmpty(this.id)) {
      throw new ArgumentInvalidException('Entity ID cannot be empty');
    }

    if (Guard.isEmpty(this.props)) {
      throw new ArgumentInvalidException('Entity props cannot be empty');
    }

    this.validateInvariants();
  }

  protected abstract validateInvariants(): void;
}
