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
}
