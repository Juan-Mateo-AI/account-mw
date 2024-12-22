import { IsDefined, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { CurrentUser } from '../../../interfaces';
import { Type } from 'class-transformer';
import { CompanyDto } from './company.dto';

export class UpdateCompanyDto {
  @IsOptional()
  currentUser: CurrentUser;

  @IsUUID()
  @IsDefined()
  companyId: string;

  @ValidateNested()
  @Type(() => CompanyDto)
  company: CompanyDto;
}
