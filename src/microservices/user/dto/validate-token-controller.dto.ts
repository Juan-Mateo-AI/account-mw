import { IsDefined, IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class ValidateTokenControllerDto {
  @IsDefined()
  type: string;

  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  token: string;
}
