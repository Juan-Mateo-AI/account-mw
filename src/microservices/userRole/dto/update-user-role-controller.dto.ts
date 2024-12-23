import { Type } from 'class-transformer';
import { IsDefined, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CurrentUser } from '../../../interfaces';
import { UpdateUserRoleDto } from './update-user-role.dto';

export class UpdateUserRoleControllerDto {
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateUserRoleDto)
  userRole: UpdateUserRoleDto;

  @IsUUID()
  userRoleId: string;

  @IsOptional()
  currentUser: CurrentUser;
}
