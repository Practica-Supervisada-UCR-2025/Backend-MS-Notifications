import { Request, Response } from 'express';
import { sendEmailController, sendRegisterConfirmationController } from '../../../src/features/notifications/email/controllers/email.controller';
import * as emailService from '../../../src/features/notifications/email/services/email.service';
import { SendPasswordResetEmailDto } from '../../../src/features/notifications/email/dto/SendPasswordResetEmailDto';
import { SendConfirmationRegisterDto } from '../../../src/features/notifications/email/dto/SendConfirmationRegisterDto';

jest.mock('../../../src/features/notifications/email/services/email.service');

describe('sendEmailController', () => {
  const mockRequest = (body: Partial<SendPasswordResetEmailDto>): Request =>
    ({ body } as Request);

  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should return 400 if required fields are missing', async () => {
    const req = mockRequest({ email: 'user@example.com' }); // missing recoveryLink
    const res = mockResponse();

    await sendEmailController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });

  it('should call service and return 200 on success', async () => {
    const dto: SendPasswordResetEmailDto = {
      email: 'test@example.com',
      recoveryLink: 'https://example.com/reset'
    };
    const req = mockRequest(dto);
    const res = mockResponse();

    (emailService.sendPasswordResetEmail as jest.Mock).mockResolvedValueOnce(undefined);

    await sendEmailController(req, res);

    expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email sent successfully!' });
  });

  it('should return 500 if service throws an error', async () => {
    const dto: SendPasswordResetEmailDto = {
      email: 'fail@example.com',
      recoveryLink: 'https://example.com/reset'
    };
    const req = mockRequest(dto);
    const res = mockResponse();

    (emailService.sendPasswordResetEmail as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    await sendEmailController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to send email' });
  });
});

describe('sendRegisterConfirmationController', () => {
  const mockRequest = (body: Partial<SendConfirmationRegisterDto>): Request =>
    ({ body } as Request);

  const mockResponse = (): Response => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('should return 400 if any required field is missing', async () => {
    const cases: Partial<SendConfirmationRegisterDto>[] = [
      { email: 'test@example.com', full_name: 'Test User' }, // missing userType
      { email: 'test@example.com', userType: 'mobile' as const }, // missing full_name
      { full_name: 'Test User', userType: 'mobile' as const }, // missing email
    ];

    for (const testCase of cases) {
      const req = mockRequest(testCase);
      const res = mockResponse();

      await sendRegisterConfirmationController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    }
  });

  it('should send confirmation email successfully for mobile user', async () => {
    const dto: SendConfirmationRegisterDto = {
      email: 'test@example.com',
      full_name: 'Test User',
      userType: 'mobile'
    };
    const req = mockRequest(dto);
    const res = mockResponse();

    (emailService.sendConfirmationRegister as jest.Mock).mockResolvedValueOnce(undefined);

    await sendRegisterConfirmationController(req, res);

    expect(emailService.sendConfirmationRegister).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email sent successfully!' });
  });

  it('should send confirmation email successfully for web user', async () => {
    const dto: SendConfirmationRegisterDto = {
      email: 'admin@example.com',
      full_name: 'Admin User',
      userType: 'web'
    };
    const req = mockRequest(dto);
    const res = mockResponse();

    (emailService.sendConfirmationRegister as jest.Mock).mockResolvedValueOnce(undefined);

    await sendRegisterConfirmationController(req, res);

    expect(emailService.sendConfirmationRegister).toHaveBeenCalledWith(dto);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email sent successfully!' });
  });

  it('should return 500 if service throws an error', async () => {
    const dto: SendConfirmationRegisterDto = {
      email: 'test@example.com',
      full_name: 'Test User',
      userType: 'mobile'
    };
    const req = mockRequest(dto);
    const res = mockResponse();

    (emailService.sendConfirmationRegister as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    await sendRegisterConfirmationController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Failed to send email' });
  });
});
