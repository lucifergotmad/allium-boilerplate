import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import type { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { UserUniquenessService } from '@modules/user/domain/services/user.uniqueness.service';
import { ClientSession } from 'mongoose';
import { InjectUserRepository } from '@modules/user/infrastructure/persistence/repositories/user.repository.provider';
import { ConflictException, NotFoundException } from '@shared/core/exceptions/common.exceptions';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand, string> {
  constructor(
    @InjectUserRepository private readonly userRepository: UserRepositoryPort,
    private readonly hashService: HashServicePort,
    private readonly uniquenessService: UserUniquenessService
  ) {}

  async execute(command: UpdateUserCommand): Promise<string> {
    const { userId, dto } = command;

    const result = await this.userRepository.transaction(async (session: ClientSession) => {
      const user = await this.userRepository.findOneById(userId, session);
      if (!user) throw new NotFoundException('User not found');

      if (dto.email && dto.email !== user.email.value) {
        const isUnique = await this.uniquenessService.isEmailUnique(dto.email, session);
        if (!isUnique) throw new ConflictException('Email already taken');
      }

      let newHashedPassword: string | undefined;
      if (dto.password) {
        newHashedPassword = await this.hashService.generate(dto.password, 10);
      }

      if (dto.refreshToken) {
        user.updateRefreshToken(dto.refreshToken);
      }

      user.updateProfile({
        ...dto,
        password: newHashedPassword || user.password,
      });

      await this.userRepository.save(user, session);

      return user.id;
    });

    return result;
  }
}
