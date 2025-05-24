jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(() => Promise.resolve()),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

import request from 'supertest';
import { app } from '../../../src/app';
import * as pushService from '../../../src/features/notifications/push/services/pushNotification.service';
import { generateTestToken } from '../../../test-api/utils/generateTestToken.test';

jest.mock('../../../src/features/notifications/push/services/pushNotification.service');

const adminToken = 'Bearer ' + generateTestToken({ role: 'admin', id: '123' });

describe('POST /api/push-notifications/register-fmc-token', () => {
    const mockSave = pushService.saveFmcToken as jest.Mock;
    const mockSend = pushService.sendNotificationToUser as jest.Mock;
    const mockSendAll = pushService.sendNotificationToAllUsers as jest.Mock;

    // Default: clear all mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Default: all mocks resolve to undefined unless overridden in a test
        mockSave.mockImplementation(() => Promise.resolve());
        mockSend.mockImplementation(() => Promise.resolve());
        mockSendAll.mockImplementation(() => Promise.resolve());
    });

    it('should return 201 and saved token on success', async () => {
        // Simulate a dynamic token
        const body = { fcmToken: 'dynamic-token-value', deviceType: 'android', userId: 'user1' };
        // The controller may generate a new token, so match any string
        mockSave.mockResolvedValueOnce({
            fcmToken: 'some-generated-token',
            deviceType: 'android',
            userId: 'user1'
        });

        const response = await request(app)
            .post('/api/push-notifications/register-fmc-token')
            .set('Authorization', adminToken)
            .send(body);

        // Debug: Uncomment to see the error returned by the controller
        // console.log(response.body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(expect.objectContaining({
            fcmToken: expect.any(String),
            deviceType: 'android',
            userId: 'user1'
        }));
        expect(mockSave).toHaveBeenCalledWith(expect.objectContaining({
            fcmToken: expect.any(String),
            deviceType: 'android',
            userId: 'user1'
        }));
    });

    it('should return 400 if required fields are missing', async () => {
        // Do not set up the mock!
        const response = await request(app)
            .post('/api/push-notifications/register-fmc-token')
            .set('Authorization', adminToken)
            .send({ fcmToken: 'token', deviceType: 'android' }); // missing userId

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'All fields are required' });
        expect(mockSave).not.toHaveBeenCalled();
    });

    it('should return 500 if service throws', async () => {
        mockSave.mockRejectedValueOnce(new Error('DB error'));

        const response = await request(app)
            .post('/api/push-notifications/register-fmc-token')
            .set('Authorization', adminToken)
            .send({ fcmToken: 'token', deviceType: 'android', userId: 'user1' });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error saving FMC token');
    });
});

describe('POST /api/push-notifications/send-to-user', () => {
    const mockSend = pushService.sendNotificationToUser as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 on success', async () => {
        mockSend.mockResolvedValueOnce(undefined);

        const response = await request(app)
            .post('/api/push-notifications/send-to-user')
            .set('Authorization', adminToken)
            .send({ userId: 'user1', title: 't', body: 'b', name: 'n', publicationId: '12345' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Notification sent to user successfully!' });
        expect(mockSend).toHaveBeenCalledWith({ userId: 'user1', title: 't', body: 'b', name: 'n', publicationId: '12345' });
    });

    it('should return 400 if required fields are missing', async () => {
        // Do not set up the mock!
        const response = await request(app)
            .post('/api/push-notifications/send-to-user')
            .set('Authorization', adminToken)
            .send({ userId: 'user1', title: 't', body: 'b' }); // missing name

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ message: 'Missing required fields' });
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('should return 500 if service throws', async () => {
        mockSend.mockRejectedValueOnce(new Error('fail'));

        const response = await request(app)
            .post('/api/push-notifications/send-to-user')
            .set('Authorization', adminToken)
            .send({ userId: 'user1', title: 't', body: 'b', name: 'n', publicationId: '12345' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Failed to send notification to user' });
    });
});

describe('POST /api/push-notifications/send-to-all', () => {
    const mockSendAll = pushService.sendNotificationToAllUsers as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 on success', async () => {
        mockSendAll.mockResolvedValueOnce(undefined);

        const response = await request(app)
            .post('/api/push-notifications/send-to-all')
            .set('Authorization', adminToken)
            .send({ title: 't', body: 'b', name: 'n' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Notification sent to all users successfully!' });
        expect(mockSendAll).toHaveBeenCalledWith({ title: 't', body: 'b', name: 'n' });
    });

    it('should return 500 if service throws', async () => {
        mockSendAll.mockRejectedValueOnce(new Error('fail'));

        const response = await request(app)
            .post('/api/push-notifications/send-to-all')
            .set('Authorization', adminToken)
            .send({ title: 't', body: 'b', name: 'n' });

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Failed to send notification to all users' });
    });
});