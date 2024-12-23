import { IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class DeleteUserRoleControllerDto {
  @IsUUID()
  companyId: string;

  @IsUUID()
  userRoleId: string;

  @IsOptional()
  currentUser: CurrentUser;
}
