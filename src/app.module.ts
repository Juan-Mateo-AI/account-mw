import { Module } from '@nestjs/common';
import { AuthModule } from './microservices/auth/auth.module';
import { NatsModule } from './transports/nats.module';
import { UserModule } from './microservices/user/user.module';
import { CompanyModule } from './microservices/company/company.module';

@Module({
  imports: [AuthModule, NatsModule, UserModule, CompanyModule],
})
export class AppModule {}
