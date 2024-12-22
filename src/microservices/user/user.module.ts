import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { NatsModule } from '../../transports/nats.module';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [NatsModule],
})
export class UserModule {}
