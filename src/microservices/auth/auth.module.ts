import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { NatsModule } from '../../transports/nats.module';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [NatsModule],
})
export class AuthModule {}
