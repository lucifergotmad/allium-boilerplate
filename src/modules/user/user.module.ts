import { UserFacade } from '@modules/user/api/user.facade';
import { CreateUserHandler } from '@modules/user/application/commands/create-user/create-user.handler';
import { UpdateUserHandler } from '@modules/user/application/commands/update-user/update-user.handler';
import { GetUserAuthInfoHandler } from '@modules/user/application/queries/get-user-auth-info/get-user-auth-info.handler';
import { GetUserByIdHandler } from '@modules/user/application/queries/get-user-by-id/get-user-by-id.handler';
import { GetUsersHandler } from '@modules/user/application/queries/get-users/get-users.handler';
import { UserUniquenessService } from '@modules/user/domain/services/user.uniqueness.service';
import { UserController } from '@modules/user/infrastructure/controllers/user.controller';
import { UserPersistenceModule } from '@modules/user/infrastructure/persistence/user.persistence.module';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [CqrsModule, UserPersistenceModule, SharedModule],
  controllers: [UserController],
  providers: [
    UserFacade,
    UserUniquenessService,
    CreateUserHandler,
    GetUserAuthInfoHandler,
    GetUserByIdHandler,
    GetUsersHandler,
    UpdateUserHandler,
  ],
  exports: [UserFacade],
})
export class UserModule {}
