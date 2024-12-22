import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { CompanyIdDto, UpdateCompanyDto } from './dto';
import { CompanyService } from './company.service';

@Controller('user')
export class CompanyController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly companyService: CompanyService,
  ) {}

  @MessagePattern('account.company.update')
  async updateCompany(
    @Body() { companyId, currentUser, company }: UpdateCompanyDto,
  ) {
    await this.companyService.authorizeUpdateCompany(companyId, currentUser);

    return this.client
      .send('companies.update', {
        currentUser,
        companyId,
        company,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.company.get')
  async getCompany(@Body() { companyId, currentUser }: CompanyIdDto) {
    await this.companyService.authorizeGetCompany(companyId, currentUser);

    return this.client
      .send('companies.find', {
        companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
