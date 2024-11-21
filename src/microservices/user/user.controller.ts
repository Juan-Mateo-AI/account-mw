import { Body, Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { CreateUserDto } from './dto';
import { catchError } from 'rxjs';
import { User } from '../../decorators';
import { CurrentUser } from '../../interfaces';

@Controller('user')
export class UserController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @MessagePattern('account.user.create')
  registerUser(@User() user: CurrentUser, @Body() userToCreate: CreateUserDto) {
    console.log('user', user);
    console.log('userToCreate', userToCreate);
    // return this.client.send('auth.register.user', registerUserDto).pipe(
    //   catchError((error) => {
    //     throw new RpcException(error);
    //   }),
    // );
  }
}
