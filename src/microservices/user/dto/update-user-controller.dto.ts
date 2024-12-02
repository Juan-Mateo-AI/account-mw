import { IsDefined, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { UpdateUserDto } from './update-user.dto';
import { CurrentUser } from '../../../interfaces';
import { Type } from 'class-transformer';

export class UpdateUserControllerDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateUserDto)
  userToUpdate: UpdateUserDto;

  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  userId: string;
}
