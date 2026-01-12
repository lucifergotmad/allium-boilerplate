import { Entity } from '@shared/domain/base-classes/entity.base';

export class Guard {
  static isEmpty(value: unknown): boolean {
    const falseCondition =
      typeof value === 'number' || typeof value === 'boolean' || value instanceof Date;

    if (falseCondition) {
      return false;
    }

    if (typeof value === 'undefined' || value === null) {
      return true;
    }

    if (value instanceof Object && !Object.keys(value).length) {
      return true;
    }

    if (Array.isArray(value)) {
      if (!value.length) {
        return true;
      }
    }

    if (value === '') {
      return true;
    }

    return false;
  }

  static isDuplicate(props: unknown[]): boolean {
    return !!props.find((value, index) => props.indexOf(value) !== index);
  }

  static isEntity(v: unknown): v is Entity<unknown> {
    return v instanceof Entity;
  }
}
