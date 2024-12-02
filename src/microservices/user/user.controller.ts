import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { UpdateUserControllerDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @MessagePattern('account.user.update')
  async updateUser(
    @Body() { userId, currentUser, userToUpdate }: UpdateUserControllerDto,
  ) {
    const currentUserToUpdate = await firstValueFrom(
      this.client.send('users.findOneById', { id: userId }),
    );

    if (!currentUserToUpdate) {
      throw new RpcException({
        status: 400,
        message: 'User not found',
      });
    }

    if (
      currentUserToUpdate.id === currentUser.id ||
      (currentUserToUpdate.companyId === currentUser.company.id &&
        currentUser.userRole.isAdmin)
    ) {
      return this.client
        .send('users.update', {
          userToUpdate: {
            ...currentUserToUpdate,
            ...userToUpdate,
            id: userId,
          },
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
        );
    } else {
      throw new RpcException({
        status: 403,
        message: 'Unauthorized',
      });
    }
  }
}
