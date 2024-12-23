import { Type } from 'class-transformer';
import { IsDefined, IsOptional, ValidateNested } from 'class-validator';
import { CurrentUser } from '../../../interfaces';
import { CreateUserRoleDto } from './create-user-role.dto';

export class CreateUserRoleControllerDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => CreateUserRoleDto)
  userRole: CreateUserRoleDto;

  @IsOptional()
  currentUser: CurrentUser;
}
