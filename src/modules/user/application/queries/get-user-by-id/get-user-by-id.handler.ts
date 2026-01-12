import { UserResponseDto } from '@modules/user/application/dtos/user.response.dto';
import { GetUserByIdQuery } from '@modules/user/application/queries/get-user-by-id/get-user-by.id.query';
import { UserReadModel } from '@modules/user/infrastructure/persistence/read-models/user.read-model.service';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@shared/core/exceptions/common.exceptions';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly readModel: UserReadModel) {}

  async execute(query: GetUserByIdQuery): Promise<UserResponseDto> {
    const result = await this.readModel.findById(query.id);
    if (!result) throw new NotFoundException('User tidak dapat ditemukan!');

    return result;
  }
}
