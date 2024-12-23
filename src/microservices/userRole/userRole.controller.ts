import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { catchError } from 'rxjs';
import { UserRoleService } from './userRole.service';
import { GetUserRoleControllerDto, UpdateUserRoleControllerDto } from './dto';
import { CreateUserRoleControllerDto } from './dto/create-user-role-controller.dto';
import { GetAllUserRolesDto } from './dto/get-all-user-roles.dto';
import { DeleteUserRoleControllerDto } from './dto/delete-user-role-controller.dto';

@Controller()
export class UserRoleController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly userRoleService: UserRoleService,
  ) {}

  @MessagePattern('account.userRoles.create')
  async createUserRole(
    @Body() { userRole, currentUser }: CreateUserRoleControllerDto,
  ) {
    await this.userRoleService.authorizeCreateUserRole(userRole, currentUser);

    return this.client
      .send('userRoles.create', {
        userRole: { ...userRole, companyId: currentUser.companyId },
        currentUser,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.userRoles.update')
  async updateUserRole(
    @Body() { userRole, currentUser, userRoleId }: UpdateUserRoleControllerDto,
  ) {
    await this.userRoleService.authorizeCreateUserRole(
      userRole as any,
      currentUser,
    );

    return this.client
      .send('userRoles.update', {
        currentUser,
        userRole,
        userRoleId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.userRoles.get')
  async getUserRole(
    @Body() { userRoleId, currentUser }: GetUserRoleControllerDto,
  ) {
    await this.userRoleService.authorizeGetUserRole(currentUser);

    return this.client
      .send('userRoles.find', {
        currentUser,
        userRoleId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.userRoles.getAll')
  async getAllUserRoles(
    @Body()
    { companyId, page, pageSize, currentUser }: GetAllUserRolesDto,
  ) {
    await this.userRoleService.authorizeGetUserRole(currentUser);

    return this.client
      .send('userRoles.findAll', {
        companyId,
        page,
        pageSize,
        currentUser,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.userRoles.delete')
  async deleteUserRole(
    @Body()
    { companyId, userRoleId, currentUser }: DeleteUserRoleControllerDto,
  ) {
    await this.userRoleService.authorizeDeleteUserRole(userRoleId, currentUser);

    return this.client
      .send('userRoles.delete', {
        companyId,
        userRoleId,
        currentUser,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
