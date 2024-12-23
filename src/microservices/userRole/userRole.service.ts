import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { CurrentUser } from '../../interfaces';
import { AGENT, DEFAULT_USER_ROLES_NAMES } from '../../constants';
import { CreateUserRoleDto } from './dto';

@Injectable()
export class UserRoleService {
  async authorizeCreateUserRole(
    userRole: CreateUserRoleDto,
    currentUser: CurrentUser,
  ) {
    if (currentUser.userRole.name === AGENT || !currentUser.userRole.isAdmin) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Non admin users cannot modify user roles',
      });
    }

    if (userRole.companyId !== currentUser.companyId) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message:
          'You cannot modify a user role for a company different than yours',
      });
    }

    if (userRole.name && DEFAULT_USER_ROLES_NAMES.includes(userRole.name)) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: `UserRole name cannot be the same as [${DEFAULT_USER_ROLES_NAMES}]`,
      });
    }
  }

  async authorizeGetUserRole(currentUser: CurrentUser) {
    if (
      currentUser?.userRole?.name === AGENT ||
      !currentUser?.userRole?.isAdmin
    ) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Non admin users cannot get user roles',
      });
    }
  }

  async authorizeDeleteUserRole(userRoleId: string, currentUser: CurrentUser) {
    if (
      currentUser?.userRole?.name === AGENT ||
      !currentUser?.userRole?.isAdmin
    ) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Non admin users cannot delete user roles',
      });
    }

    if (currentUser.userRole.id === userRoleId) {
      throw new RpcException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'You cannot delete your own user role',
      });
    }
  }
}
