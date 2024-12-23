import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CurrentUser } from '../../interfaces';
import { AGENT } from '../../constants';

@Injectable()
export class AuthService {
  async authorizeRegisterUser(currentUser: CurrentUser) {
    if (
      currentUser?.userRole?.name === AGENT ||
      !currentUser?.userRole?.isAdmin
    ) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Non admin users cannot create new users',
      });
    }
  }
}
