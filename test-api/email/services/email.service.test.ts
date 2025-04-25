import { sendPasswordResetEmail, sendConfirmationRegister } from '../../../src/features/notifications/email/services/email.service';
import { SendPasswordResetEmailDto } from '../../../src/features/notifications/email/dto/SendPasswordResetEmailDto';
import { SendConfirmationRegisterDto } from '../../../src/features/notifications/email/dto/SendConfirmationRegisterDto';
import { transporter } from '../../../src/config/email.config';
import * as templateUtil from '../../../src/utils/passwordResetTemplate';
import { confirmationRegisterTemplate } from '../../../src/utils/confirmationRegisterTemplate';
import axios from 'axios';

jest.mock('axios');
jest.mock('../../../src/config/email.config', () => ({
  transporter: {
    sendMail: jest.fn(),
  },
}));

jest.mock('../../../src/utils/passwordResetTemplate', () => ({
  passwordResetTemplate: jest.fn().mockReturnValue('<html>Mock HTML</html>'),
}));

jest.mock('../../../src/utils/confirmationRegisterTemplate', () => ({
  confirmationRegisterTemplate: jest.fn().mockReturnValue('<html>Mock Registration HTML</html>'),
}));

describe('sendPasswordResetEmail', () => {
  const dto: SendPasswordResetEmailDto = {
    email: 'test@example.com',
    recoveryLink: 'https://example.com/reset',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email using the SMTP2GO API', async () => {
    mockedAxiosPost.mockResolvedValueOnce({ status: 200 });

    await sendPasswordResetEmail(dto);

    expect(templateUtil.passwordResetTemplate).toHaveBeenCalledWith(dto.recoveryLink);
    expect(mockedAxiosPost).toHaveBeenCalledWith(
      'https://api.smtp2go.com/v3/email/send',
      {
        api_key: process.env.SMTP2GO_API_KEY,
        to: [dto.email],
        sender: process.env.EMAIL_USER,
        subject: 'Reset your password',
        html_body: '<html>Mock HTML</html>',
      }
    );
  });

  it('should throw an error if API call fails', async () => {
    mockedAxiosPost.mockRejectedValueOnce(new Error('SMTP2GO Error'));

    await expect(sendPasswordResetEmail(dto)).rejects.toThrow('SMTP2GO Error');
  });
});

describe('sendConfirmationRegister', () => {
  const mockDto: SendConfirmationRegisterDto = {
    email: 'test@example.com',
    full_name: 'Test User',
    userType: 'mobile'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });
  });

  it('should send registration confirmation email for mobile users', async () => {
    await sendConfirmationRegister(mockDto);

    expect(confirmationRegisterTemplate).toHaveBeenCalledWith('mobile', 'Test User');
    expect(axios.post).toHaveBeenCalledWith('https://api.smtp2go.com/v3/email/send', {
      api_key: process.env.SMTP2GO_API_KEY,
      to: [mockDto.email],
      sender: process.env.EMAIL_USER,
      subject: 'Registration Confirmation',
      html_body: '<html>Mock Registration HTML</html>',
    });
  });

  it('should send registration confirmation email for web users', async () => {
    const webDto = { ...mockDto, userType: 'web' as const };
    
    await sendConfirmationRegister(webDto);

    expect(confirmationRegisterTemplate).toHaveBeenCalledWith('web', 'Test User');
    expect(axios.post).toHaveBeenCalledWith('https://api.smtp2go.com/v3/email/send', {
      api_key: process.env.SMTP2GO_API_KEY,
      to: [webDto.email],
      sender: process.env.EMAIL_USER,
      subject: 'Registration Confirmation',
      html_body: '<html>Mock Registration HTML</html>',
    });
  });

  it('should throw error if smtp2go request fails', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('SMTP Error'));

    await expect(sendConfirmationRegister(mockDto)).rejects.toThrow('SMTP Error');
  });
});
