import type { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { DeleteUserCommand } from '@modules/user/application/commands/delete-user/delete-user.command';
import { InjectUserRepository } from '@modules/user/infrastructure/persistence/repositories/user.repository.provider';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ClientSession } from 'mongoose';
import { NotFoundException } from '@shared/core/exceptions/common.exceptions';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, void> {
  constructor(@InjectUserRepository private readonly userRepository: UserRepositoryPort) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    await this.userRepository.transaction(async (session: ClientSession) => {
      const user = await this.userRepository.findOneById(command.id, session);
      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.deleteById(command.id, session);
    });
  }
}
