import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { UserController } from './controller/user.controller';
import { UserListHandler } from './query/user-list/user-list.handler';
import { UserService } from './service/user.service';

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [UserService, UserListHandler],
  exports: [UserService],
})
export class UserModule {}
