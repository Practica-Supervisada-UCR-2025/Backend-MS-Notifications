import axios from 'axios';
import { sendPasswordResetEmail } from '../../../src/features/notifications/email/services/email.service';
import { SendPasswordResetEmailDto } from '../../../src/features/notifications/email/dto/SendPasswordResetEmailDto';
import * as templateUtil from '../../../src/utils/passwordResetTemplate';

jest.mock('axios');
jest.mock('../../../src/utils/passwordResetTemplate', () => ({
  passwordResetTemplate: jest.fn().mockReturnValue('<html>Mock HTML</html>'),
}));

const mockedAxiosPost = axios.post as jest.Mock;

describe('sendPasswordResetEmail (SMTP2GO Web API)', () => {
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
