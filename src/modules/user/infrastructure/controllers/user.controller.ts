import { DeleteUserCommand } from '@modules/user/application/commands/delete-user/delete-user.command';
import { UpdateUserCommand } from '@modules/user/application/commands/update-user/update-user.command';
import { UpdateUserRequestDto } from '@modules/user/application/commands/update-user/update-user.request.dto';
import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { GetUserByIdQuery } from '@modules/user/application/queries/get-user-by-id/get-user-by.id.query';
import { GetUsersQuery } from '@modules/user/application/queries/get-users/get-users.query';
import { GetUsersRequestDto } from '@modules/user/application/queries/get-users/get-users.request.dto';
import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ResponseDto } from '@shared/application/dtos/base.response.dto';
import { JwtAuthGuard } from '@shared/infrastructure/auth/guards/jwt-auth.guard';

@Controller({ path: 'users' })
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async find(@Query() query: GetUsersRequestDto): Promise<UserResponseDto[]> {
    return await this.queryBus.execute(new GetUsersQuery(query.page, query.limit));
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.queryBus.execute(new GetUserByIdQuery(id));
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserRequestDto
  ): Promise<ResponseDto<null>> {
    await this.commandBus.execute(new UpdateUserCommand(id, dto));

    return ResponseDto.success(null, 'User updated successfully');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.commandBus.execute(new DeleteUserCommand(id));

    return ResponseDto.success(null, 'User deleted successfully');
  }
}
