import type { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { InjectUserRepository } from '@modules/user/infrastructure/persistence/repositories/user.repository.provider';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserUniquenessService {
  constructor(@InjectUserRepository private readonly userRepository: UserRepositoryPort) {}

  async isEmailUnique(email: string, session?: unknown): Promise<boolean> {
    const exists = await this.userRepository.existsByEmail(email, session);
    return !exists;
  }
}
