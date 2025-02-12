import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import {
  ActivateUserDto,
  DeleteUserControllerDto,
  GetAllUsersControllerDto,
  GetUserControllerDto,
  UpdateUserControllerDto,
} from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { ValidateTokenControllerDto } from './dto/validate-token-controller.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly userService: UserService,
  ) {}

  @MessagePattern('account.user.token.validate')
  async validateToken(@Body() { type, token }: ValidateTokenControllerDto) {
    return this.client
      .send('tokens.validate', {
        type,
        token,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }

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

  @MessagePattern('account.user.invite')
  async inviteUser(
    @Body()
    { currentUser, userToInvite },
  ) {
    return this.client
      .send('users.invite', {
        currentUser,
        userToInvite,
      })
      .pipe(
        catchError((error) => {
          console.log('error MW', error);
          throw new RpcException(error);
        }),
      );
  }

  @MessagePattern('account.user.activate')
  async activateUser(@Body() { password, token }: ActivateUserDto) {
    const user = await firstValueFrom(
      this.client.send('tokens.expireAndGetUser', { token }).pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      ),
    );

    if (!user) {
      throw new RpcException({
        status: 404,
        message: 'User not found',
      });
    }

    return this.client
      .send('auth.register.user', {
        name: user.name,
        email: user.email,
        password: password,
      })
      .pipe(
        catchError((error) => {
          throw new RpcException(error);
        }),
      );
  }
}
