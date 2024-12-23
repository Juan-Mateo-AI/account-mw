import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CurrentUser, User } from '../../interfaces';
import { AGENT, SUPER_ADMIN } from '../../constants';

@Injectable()
export class UserService {
  async authorizeUpdateUser(
    userIdOfUserToUpdate: string,
    currentUser: CurrentUser,
  ) {
    if (
      (currentUser?.userRole?.name === AGENT ||
        !currentUser?.userRole?.isAdmin) &&
      currentUser.id !== userIdOfUserToUpdate
    ) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Non admin users cannot update users',
      });
    }
  }

  async authorizeDeleteUser(userToDelete: User, currentUser: CurrentUser) {
    if (
      currentUser?.userRole?.name === AGENT ||
      !currentUser?.userRole?.isAdmin
    ) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Non admin users cannot delete users',
      });
    }

    if (userToDelete.userRole.name === SUPER_ADMIN) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Super Admins cannot be deleted',
      });
    }

    if (userToDelete.id === currentUser.id) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'You cannot delete yourself',
      });
    }
  }
}
