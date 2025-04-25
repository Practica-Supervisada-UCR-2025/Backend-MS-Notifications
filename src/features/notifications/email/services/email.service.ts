// src/features/notifications/email/services/email.service.ts
import axios from 'axios';
import { SendPasswordResetEmailDto } from '../dto/SendPasswordResetEmailDto';
import { passwordResetTemplate } from '../../../../utils/passwordResetTemplate';

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
