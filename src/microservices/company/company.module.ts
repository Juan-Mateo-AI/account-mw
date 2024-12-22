import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { NatsModule } from '../../transports/nats.module';
import { CompanyService } from './company.service';

@Module({
  providers: [CompanyService],
  controllers: [CompanyController],
  imports: [NatsModule],
})
export class CompanyModule {}
