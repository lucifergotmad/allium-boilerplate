import { v7 as uuidv7 } from 'uuid';

export class UUID {
  static generate(): string {
    return uuidv7();
  }
}
