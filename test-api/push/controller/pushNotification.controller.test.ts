import { Request, Response } from 'express';
import { sendNotificationToUserController, sendNotificationToAllUsersController, registerFmcToken } from '../../../src/features/notifications/push/controllers/pushNotification.controller';
import * as pushService from '../../../src/features/notifications/push/services/pushNotification.service';
import { SendNotificationDto } from '../../../src/features/notifications/push/dto/pushNotificationDto';

jest.mock('../../../src/features/notifications/push/services/pushNotification.service');

describe('registerFmcToken', () => {
    const mockRequest = (body: any): Request => ({ body } as Request);
    const mockResponse = (): Response => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('should return 400 if required fields are missing', async () => {
        const req = mockRequest({ fcmToken: 'token', deviceType: 'android' }); // missing userId
        const res = mockResponse();

        await registerFmcToken(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'All fields are required' });
    });

    it('should save token and return 201 on success', async () => {
        const reqBody = { fcmToken: 'token', deviceType: 'android', userId: 'user1' };
        const req = mockRequest(reqBody);
        const res = mockResponse();

        (pushService.saveFmcToken as jest.Mock).mockResolvedValueOnce(reqBody);

        await registerFmcToken(req, res);

        expect(pushService.saveFmcToken).toHaveBeenCalledWith(reqBody);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(reqBody);
    });

    it('should return 500 if service throws', async () => {
        const reqBody = { fcmToken: 'token', deviceType: 'android', userId: 'user1' };
        const req = mockRequest(reqBody);
        const res = mockResponse();

        (pushService.saveFmcToken as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        await registerFmcToken(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error saving FMC token', error: 'DB error' });
    });
});

describe('sendNotificationToUserController', () => {
    const mockRequest = (body: any): Request => ({ body } as Request);
    const mockResponse = (): Response => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('should return 400 if required fields are missing', async () => {
        const req = mockRequest({ userId: 'user1', title: 't', body: 'b' }); // missing name
        const res = mockResponse();

        await sendNotificationToUserController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should send notification and return 200 on success', async () => {
        const dto: SendNotificationDto = { userId: 'user1', title: 't', body: 'b', name: 'n' };
        const req = mockRequest(dto);
        const res = mockResponse();

        (pushService.sendNotificationToUser as jest.Mock).mockResolvedValueOnce(undefined);

        await sendNotificationToUserController(req, res);

        expect(pushService.sendNotificationToUser).toHaveBeenCalledWith(dto);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Notification sent to user successfully!' });
    });

    it('should return 500 if service throws', async () => {
        const dto: SendNotificationDto = { userId: 'user1', title: 't', body: 'b', name: 'n' };
        const req = mockRequest(dto);
        const res = mockResponse();

        (pushService.sendNotificationToUser as jest.Mock).mockRejectedValueOnce(new Error('Error'));

        await sendNotificationToUserController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to send notification to user' });
    });
});

describe('sendNotificationToAllUsersController', () => {
    const mockRequest = (body: any): Request => ({ body } as Request);
    const mockResponse = (): Response => {
        const res = {} as Response;
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    it('should return 400 if required fields are missing', async () => {
        const req = mockRequest({ body: 'b' }); // missing title
        const res = mockResponse();

        await sendNotificationToAllUsersController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
    });

    it('should send notifications and return 200 on success', async () => {
        const dto = { title: 't', body: 'b', name: 'n' };
        const req = mockRequest(dto);
        const res = mockResponse();

        (pushService.sendNotificationToAllUsers as jest.Mock).mockResolvedValueOnce(undefined);

        await sendNotificationToAllUsersController(req, res);

        expect(pushService.sendNotificationToAllUsers).toHaveBeenCalledWith(dto);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Notification sent to all users successfully!' });
    });

    it('should return 500 if service throws', async () => {
        const dto = { title: 't', body: 'b', name: 'n' };
        const req = mockRequest(dto);
        const res = mockResponse();

        (pushService.sendNotificationToAllUsers as jest.Mock).mockRejectedValueOnce(new Error('Error'));

        await sendNotificationToAllUsersController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Failed to send notification to all users' });
    });
});