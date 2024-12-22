import { IsDefined, IsOptional, IsUUID } from 'class-validator';
import { CurrentUser } from '../../../interfaces';

export class CompanyIdDto {
  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  companyId: string;
}
