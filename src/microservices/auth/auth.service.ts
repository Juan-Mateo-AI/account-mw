import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CurrentUser } from '../../interfaces';
import { UserToCreateDto } from './dto/user-to-create';
import { AGENT, SUPER_ADMIN } from '../../constants';

@Injectable()
export class AuthService {
  async authorizeRegisterUser(currentUser: CurrentUser) {
    if (
      currentUser?.userRole?.name === AGENT ||
      !currentUser?.userRole?.isAdmin
    ) {
      throw new RpcException({
        status: 401,
        message: 'Non admin users cannot create new users',
      });
    }
  }
}
