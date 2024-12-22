import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import {
  DeleteUserControllerDto,
  GetAllUsersControllerDto,
  GetUserControllerDto,
  UpdateUserControllerDto,
} from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly userService: UserService,
  ) {}

  @MessagePattern('account.user.update')
  async updateUser(
    @Body() { userId, currentUser, userToUpdate }: UpdateUserControllerDto,
  ) {
    await this.userService.authorizeUpdateUser(userId, currentUser);

    return this.client
      .send('users.update', {
        currentUser,
        userToUpdate,
        userId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.user.get')
  async getUser(@Body() { userId, currentUser }: GetUserControllerDto) {
    return this.client
      .send('users.findOneById', {
        id: userId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.user.getAll')
  async getAllUsers(
    @Body()
    { companyId, page, pageSize, currentUser }: GetAllUsersControllerDto,
  ) {
    return this.client
      .send('users.findAllByCompanyId', {
        companyId,
        page,
        pageSize,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.user.delete')
  async deleteUser(
    @Body()
    { companyId, userId, currentUser }: DeleteUserControllerDto,
  ) {
    const userToDelete = await firstValueFrom(
      this.client.send('users.findOneById', { id: userId }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );

    if (!userToDelete) {
      throw new RpcException({
        status: 404,
        message: 'User not found',
      });
    }

    await this.userService.authorizeDeleteUser(userToDelete, currentUser);

    await firstValueFrom(
      this.client.send('auth.delete.user', { email: userToDelete.email }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );

    return this.client
      .send('users.delete', {
        userId,
        companyId,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
