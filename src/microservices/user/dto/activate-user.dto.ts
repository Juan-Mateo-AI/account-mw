import { IsDefined, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ActivateUserDto {
  @IsString()
  @IsStrongPassword()
  @IsDefined()
  password: string;

  @IsUUID()
  @IsDefined()
  token: string;
}
