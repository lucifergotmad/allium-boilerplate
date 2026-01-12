import { UserInternalDto } from '@modules/user/api/dtos/user.internal.dto';
import { CreateUserCommand } from '@modules/user/application/commands/create-user/create-user.command';
import { CreateUserRequestDto } from '@modules/user/application/commands/create-user/create-user.request.dto';
import { UpdateUserCommand } from '@modules/user/application/commands/update-user/update-user.command';
import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { GetUserAuthInfoRequestDto } from '@modules/user/application/queries/get-user-auth-info/get-user-auth-info.request.dto';
import { GetUserAuthInfoQuery } from '@modules/user/application/queries/get-user-auth-info/get-user-auth.info.query';
import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Injectable()
export class UserFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async createUser(dto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.commandBus.execute(new CreateUserCommand(dto));
  }

  async findOneByEmailForAuth(email: string): Promise<UserInternalDto | null> {
    const requestDto = new GetUserAuthInfoRequestDto(email);
    const query = new GetUserAuthInfoQuery(requestDto);

    return this.queryBus.execute(query);
  }

  async updateRefreshToken(userId: string, refreshTokenHashed: string | null): Promise<void> {
    await this.commandBus.execute(
      new UpdateUserCommand(userId, { refreshToken: refreshTokenHashed })
    );
  }
}
