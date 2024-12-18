import { IsDefined, IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class GetUserControllerDto {
  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  userId: string;
}
