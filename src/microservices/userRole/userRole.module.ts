import { Module } from '@nestjs/common';
import { NatsModule } from '../../transports/nats.module';
import { UserRoleController } from './userRole.controller';
import { UserRoleService } from './userRole.service';

@Module({
  providers: [UserRoleService],
  controllers: [UserRoleController],
  imports: [NatsModule],
})
export class UserRoleModule {}
