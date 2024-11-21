import { IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class UserToCreateDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsUUID()
  companyId: string;

  @IsUUID()
  userRoleId: string;
}
