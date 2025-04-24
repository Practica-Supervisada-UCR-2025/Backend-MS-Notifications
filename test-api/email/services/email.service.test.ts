import { sendPasswordResetEmail } from '../../../src/features/notifications/email/services/email.service';
import { SendPasswordResetEmailDto } from '../../../src/features/notifications/email/dto/SendPasswordResetEmailDto';
import { transporter } from '../../../src/config/email.config';
import * as templateUtil from '../../../src/utils/passwordResetTemplate';

jest.mock('../../../src/config/email.config', () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

jest.mock('../../../src/utils/passwordResetTemplate', () => ({
  passwordResetTemplate: jest.fn().mockReturnValue('<html>Mock HTML</html>'),
}));

describe('sendPasswordResetEmail', () => {
  const dto: SendPasswordResetEmailDto = {
    email: 'test@example.com',
    recoveryLink: 'https://example.com/reset',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email using the transporter', async () => {
    await sendPasswordResetEmail(dto);

    expect(templateUtil.passwordResetTemplate).toHaveBeenCalledWith(dto.recoveryLink);
    expect(transporter.sendMail).toHaveBeenCalledWith({
      from: `"MS Notification" <${process.env.EMAIL_USER}>`,
      to: dto.email,
      subject: 'Reset your password',
      html: '<html>Mock HTML</html>',
    });
  });

  it('should throw error if transporter.sendMail fails', async () => {
    (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error('SMTP Error'));

    await expect(sendPasswordResetEmail(dto)).rejects.toThrow('SMTP Error');
  });
});
