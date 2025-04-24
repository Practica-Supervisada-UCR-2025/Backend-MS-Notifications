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

describe('POST /api/email/send-register-confirmation', () => {
  const mockSendConfirmation = emailService.sendConfirmationRegister as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and success message for mobile user registration', async () => {
    mockSendConfirmation.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/email/send-register-confirmation')
      .send({
        email: 'test@example.com',
        full_name: 'Test User',
        userType: 'mobile'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Email sent successfully!' });
    expect(mockSendConfirmation).toHaveBeenCalledWith({
      email: 'test@example.com',
      full_name: 'Test User',
      userType: 'mobile'
    });
  });

  it('should return 200 and success message for web admin registration', async () => {
    mockSendConfirmation.mockResolvedValue(undefined);

    const response = await request(app)
      .post('/api/email/send-register-confirmation')
      .send({
        email: 'admin@example.com',
        full_name: 'Admin User',
        userType: 'web'
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Email sent successfully!' });
    expect(mockSendConfirmation).toHaveBeenCalledWith({
      email: 'admin@example.com',
      full_name: 'Admin User',
      userType: 'web'
    });
  });

  it('should return 400 if required fields are missing', async () => {
    const testCases = [
      { email: 'test@example.com', full_name: 'Test User' }, // missing userType
      { email: 'test@example.com', userType: 'mobile' }, // missing full_name
      { full_name: 'Test User', userType: 'mobile' }, // missing email
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post('/api/email/send-register-confirmation')
        .send(testCase);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Missing required fields' });
    }
  });

  it('should return 500 if email service throws', async () => {
    mockSendConfirmation.mockRejectedValue(new Error('SMTP fail'));

    const response = await request(app)
      .post('/api/email/send-register-confirmation')
      .send({
        email: 'test@example.com',
        full_name: 'Test User',
        userType: 'mobile'
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Failed to send email' });
  });
});
