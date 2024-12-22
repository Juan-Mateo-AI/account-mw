import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { CurrentUser } from '../../../interfaces';
import { UserToCreateDto } from './user-to-create';
import { Type } from 'class-transformer';

export class RegisterUserDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UserToCreateDto)
  userToCreate: UserToCreateDto;

  @IsOptional()
  currentUser: CurrentUser;
}
