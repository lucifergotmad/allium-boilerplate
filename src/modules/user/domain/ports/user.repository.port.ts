import { UserEntity } from '@modules/user/domain/entities/user.entity';
import { RepositoryPort } from '@shared/domain/ports/repository.port';

export abstract class UserRepositoryPort extends RepositoryPort<UserEntity> {
  abstract existsByEmail(email: string, session?: unknown): Promise<boolean>;
}
