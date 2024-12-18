import { IsDefined, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class GetAllUsersControllerDto {
  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  companyId: string;

  @IsDefined()
  @IsNumber()
  page: number;

  @IsDefined()
  @IsNumber()
  pageSize: number;
}
