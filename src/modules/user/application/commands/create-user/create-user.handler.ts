import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserEntity } from '@modules/user/domain/entities/user.entity';
import type { UserRepositoryPort } from '@modules/user/domain/ports/user.repository.port';
import { InjectUserRepository } from '@modules/user/infrastructure/persistence/repositories/user.repository.provider';
import { UserUniquenessService } from '@modules/user/domain/services/user.uniqueness.service';
import { ConflictException } from '@shared/core/exceptions/common.exceptions';
import { ClientSession } from 'mongoose';
import { UserRole } from '@modules/user/domain/types/user.role.enum';
import { HashServicePort } from '@shared/domain/ports/hash.service.port';
import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { PasswordVO } from '@modules/user/domain/value-objects/password.value-object';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, UserResponseDto> {
  constructor(
    @InjectUserRepository
    private readonly userRepository: UserRepositoryPort,
    private readonly uniquenessService: UserUniquenessService,
    private readonly hashService: HashServicePort
  ) {}

  async execute(command: CreateUserCommand): Promise<UserResponseDto> {
    const { email, password, firstName, lastName, role } = command.dto;

    const result = await this.userRepository.transaction(async (session: ClientSession) => {
      const isUnique = await this.uniquenessService.isEmailUnique(email, session);
      if (!isUnique) {
        throw new ConflictException('User with this email already exists');
      }

      const passwordVO = new PasswordVO(password);

      const passwordHash = await this.hashService.generate(passwordVO.value, 10);

      const user = UserEntity.create({
        email,
        password: passwordHash,
        firstName,
        lastName,
        role: role ?? UserRole.ADMIN,
      });

      await this.userRepository.save(user, session);

      return user;
    });

    return UserResponseDto.fromEntity(result);
  }
}
