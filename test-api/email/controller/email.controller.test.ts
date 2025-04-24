import { Request, Response } from 'express';
import { sendEmailController } from '../../../src/features/notifications/email/controllers/email.controller';
import * as emailService from '../../../src/features/notifications/email/services/email.service';
import { SendPasswordResetEmailDto } from '../../../src/features/notifications/email/dto/SendPasswordResetEmailDto';

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
