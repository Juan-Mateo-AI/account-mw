import { CurrentUser } from '../../../interfaces';
import { UserToCreateDto } from './user-to-create';

export class RegisterUserDto {
  userToCreate: UserToCreateDto;
  currentUser: CurrentUser;
}
