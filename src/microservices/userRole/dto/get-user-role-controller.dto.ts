import { IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class GetUserRoleControllerDto {
  @IsUUID()
  userRoleId: string;

  @IsOptional()
  currentUser: CurrentUser;
}
