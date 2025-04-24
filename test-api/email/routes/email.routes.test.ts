import request from 'supertest';
import { app } from '../../../src/app';
import * as emailService from '../../../src/features/notifications/email/services/email.service';

jest.mock('../../../src/features/notifications/email/services/email.service');

describe('POST /api/email/send-password-reset', () => {
  const mockSend = emailService.sendPasswordResetEmail as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and success message if email is sent', async () => {
    mockSend.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/email/send-password-reset')
      .send({
        email: 'test@example.com',
        recoveryLink: 'https://example.com/reset'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Email sent successfully!' });
    expect(mockSend).toHaveBeenCalledWith({
      email: 'test@example.com',
      recoveryLink: 'https://example.com/reset'
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const response = await request(app)
      .post('/api/email/send-password-reset')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing required fields' });
  });

  it('should return 500 if email service throws', async () => {
    mockSend.mockRejectedValue(new Error('SMTP fail'));

    const response = await request(app)
      .post('/api/email/send-password-reset')
      .send({
        email: 'test@example.com',
        recoveryLink: 'https://example.com/reset'
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to send email' });
  });
});
