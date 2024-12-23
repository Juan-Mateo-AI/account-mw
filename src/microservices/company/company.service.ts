import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CurrentUser } from '../../interfaces';

@Injectable()
export class CompanyService {
  async authorizeUpdateCompany(companyId: string, currentUser: CurrentUser) {
    if (currentUser.companyId !== companyId) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'It is forbidden to update a company you are not assigned to',
      });
    }

    if (!currentUser.userRole.isAdmin) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Only admins are allowed to update a company',
      });
    }
  }

  async authorizeGetCompany(companyId: string, currentUser: CurrentUser) {
    if (currentUser.companyId !== companyId) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'It is forbidden to get a company you are not assigned to',
      });
    }
  }
}
