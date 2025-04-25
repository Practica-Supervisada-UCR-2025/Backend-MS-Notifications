// src/features/notifications/email/services/email.service.ts
import axios from 'axios';
import { SendPasswordResetEmailDto } from '../dto/SendPasswordResetEmailDto';
import { SendConfirmationRegisterDto, UserType } from '../dto/SendConfirmationRegisterDto';
import { passwordResetTemplate } from '../../../../utils/passwordResetTemplate';
import { confirmationRegisterTemplate } from '../../../../utils/confirmationRegisterTemplate';

export async function sendPasswordResetEmail({ email, recoveryLink }: SendPasswordResetEmailDto): Promise<void> {
  const html = passwordResetTemplate(recoveryLink);

  const payload = {
    api_key: process.env.SMTP2GO_API_KEY,
    to: [email],
    sender: process.env.EMAIL_USER,
    subject: 'Reset your password',
    html_body: html,
  };

  await axios.post('https://api.smtp2go.com/v3/email/send', payload);
}

export async function sendConfirmationRegister({ email, full_name, userType }: SendConfirmationRegisterDto): Promise<void> {
  const html = confirmationRegisterTemplate(userType, full_name);
  const payload = {
    api_key: process.env.SMTP2GO_API_KEY,
    to: [email],
    sender: process.env.EMAIL_USER,
    subject: 'Registration Confirmation',
    html_body: html,
  };
  await axios.post('https://api.smtp2go.com/v3/email/send', payload);
}