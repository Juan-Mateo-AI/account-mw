import { Body, Controller, Inject, Request } from '@nestjs/common';
import {
  ClientProxy,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { NATS_SERVICE } from 'src/config';
import { LoginUserDto, RegisterUserDto } from './dto';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
    private readonly authService: AuthService,
  ) {}

  @MessagePattern('account.register.user')
  async registerUser(
    @Payload() { userToCreate, currentUser }: RegisterUserDto,
  ) {
    await this.authService.authorizeRegisterUser(currentUser);

    const user = await firstValueFrom(
      this.client
        .send('users.create', { ...userToCreate, password: undefined })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
        ),
    );

    await firstValueFrom(
      this.client
        .send('auth.register.user', {
          name: user.name,
          email: user.email,
          password: userToCreate.password,
        })
        .pipe(
          catchError((error) => {
            throw new RpcException(error);
          }),
        ),
    );

    return user;
  }

  @MessagePattern('account.login.user')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto).pipe(
      catchError((error) => {
        throw new RpcException(error);
      }),
    );
  }

  @MessagePattern('account.verify.user')
  async verifyToken(@Body() token: string) {
    const authUser = await firstValueFrom(
      this.client.send('auth.verify.user', {
        token,
      }),
    );

    const userEntity = await firstValueFrom(
      this.client.send('users.findOne', {
        email: authUser.user.email,
      }),
    );

    return {
      user: userEntity,
      token: authUser.token,
    };
  }
}
