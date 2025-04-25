import { IsEmail, IsString, IsIn } from 'class-validator';

export type UserType = 'mobile' | 'web';

export class SendConfirmationRegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  full_name!: string;

  @IsString()
  @IsIn(['mobile', 'web'])
  userType!: UserType;
}

