import { Injectable } from '@nestjs/common';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class BcryptHashService implements HashServicePort {
  async generate(data: string, round = 10): Promise<string> {
    const salt = await genSalt(round);
    return hash(data, salt);
  }

  async compare(data: string, hashed: string): Promise<boolean> {
    return compare(data, hashed);
  }
}
