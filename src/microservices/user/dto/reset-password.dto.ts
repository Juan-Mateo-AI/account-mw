import { IsDefined, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class ResetPasswordDto {
  @IsDefined()
  @IsUUID()
  token: string;

  @IsString()
  @IsStrongPassword()
  password: string;
}
