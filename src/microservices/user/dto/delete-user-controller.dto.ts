import { IsDefined, IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class DeleteUserControllerDto {
  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  companyId: string;

  @IsUUID()
  @IsDefined()
  userId: string;
}
