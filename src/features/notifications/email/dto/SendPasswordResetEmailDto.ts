import { IsEmail, IsString } from 'class-validator';

export class SendPasswordResetEmailDto {
  @IsEmail()
  email!: string;

  @IsString()
  recoveryLink!: string;
}

