import { IsDefined, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class GetAllUserRolesDto {
  @IsDefined()
  @IsUUID()
  companyId: string;

  @IsDefined()
  @IsNumber()
  page: number;

  @IsDefined()
  @IsNumber()
  pageSize: number;

  @IsOptional()
  currentUser: CurrentUser;
}
