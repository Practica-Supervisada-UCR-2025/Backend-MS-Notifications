// src/features/notifications/email/services/email.service.ts
import { transporter } from '../../../../config/email.config';
import { SendPasswordResetEmailDto } from '../dto/SendPasswordResetEmailDto';
import { SendConfirmationRegisterDto, UserType } from '../dto/SendConfirmationRegisterDto';
import { passwordResetTemplate } from '../../../../utils/passwordResetTemplate';
import { confirmationRegisterTemplate } from '../../../../utils/confirmationRegisterTemplate';

export async function sendPasswordResetEmail({ email, recoveryLink }: SendPasswordResetEmailDto): Promise<void> {
  const html = passwordResetTemplate(recoveryLink);
  await transporter.sendMail({
    from: `"MS Notification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your password',
    html,
  });
}

export async function sendConfirmationRegister({ email, full_name, userType }: SendConfirmationRegisterDto): Promise<void> {
  const html = confirmationRegisterTemplate(userType, full_name);
  await transporter.sendMail({
    from: `"MS Notification" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Registration Confirmation',
    html,
  });
}