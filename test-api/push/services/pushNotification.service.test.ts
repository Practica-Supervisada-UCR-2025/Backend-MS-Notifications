jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(() => Promise.resolve()),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});

import * as pushService from '../../../src/features/notifications/push/services/pushNotification.service';
import admin from 'firebase-admin';
import client from '../../../src/config/database';
import { SendNotificationDto } from '../../../src/features/notifications/push/dto/pushNotificationDto';
import { FmcTokenDTO } from '../../../src/features/notifications/push/dto/fmcToken.dto';

// Mock only firebase-admin
jest.mock('firebase-admin', () => {
    const send = jest.fn();
    return {
        messaging: jest.fn(() => ({
            send,
        })),
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    // Mock the query method on the actual client instance
    (client.query as jest.Mock) = jest.fn();
});

afterAll(() => {
    jest.resetAllMocks();
});

describe('sendNotificationToUser', () => {
    it('should send notifications to all user tokens', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({
            rows: [
                { fcm_token: 'token1', device_type: 'android' },
                { fcm_token: 'token2', device_type: 'ios' },
            ],
        });
        const sendMock = (admin.messaging() as any).send as jest.Mock;
        sendMock.mockResolvedValue(undefined);

        const dto: SendNotificationDto = {
            userId: 'user1',
            title: 't',
            body: 'b',
            name: 'n',
            publicationId: '12345'
        };
        await pushService.sendNotificationToUser(dto);

        expect(sendMock).toHaveBeenCalledTimes(2);
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ token: 'token1' }));
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ token: 'token2' }));
    });
});

describe('sendNotificationToAllUsers', () => {
    it('should throw error if no tokens found', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
        const dto: Omit<SendNotificationDto, 'userId' | 'publicationId'> = {
            title: 't',
            body: 'b',
            name: 'n'
        };
        await expect(pushService.sendNotificationToAllUsers(dto)).rejects.toThrow('No FCM tokens found in the database');
    });

    it('should send notifications to all tokens', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({
            rows: [
                { fcm_token: 'token1', device_type: 'android' },
                { fcm_token: 'token2', device_type: 'ios' },
            ],
        });
        const sendMock = (admin.messaging() as any).send as jest.Mock;
        sendMock.mockResolvedValue(undefined);

        const dto: Omit<SendNotificationDto, 'userId' | 'publicationId'> = {
            title: 't',
            body: 'b',
            name: 'n'
        };
        await pushService.sendNotificationToAllUsers(dto);

        expect(sendMock).toHaveBeenCalledTimes(2);
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ token: 'token1' }));
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({ token: 'token2' }));
    });
});

describe('saveFmcToken', () => {
    it('should insert and return the saved token', async () => {
        const mockRow = { fcm_token: 'token', device_type: 'android', user_id: 'user1' };
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: [mockRow] });

        const dto: FmcTokenDTO = { fcmToken: 'token', deviceType: 'android', userId: 'user1' as any };
        const result = await pushService.saveFmcToken(dto);

        expect(client.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO fcm_tokens'),
            ['token', 'android', 'user1']
        );
        expect(result).toEqual(mockRow);
    });

    it('should throw error if query fails', async () => {
        (client.query as jest.Mock).mockRejectedValueOnce(new Error('fail'));
        const dto: FmcTokenDTO = { fcmToken: 'token', deviceType: 'android', userId: 'user1' as any };
        await expect(pushService.saveFmcToken(dto)).rejects.toThrow('fail');
    });
});

describe('sendNotificationToUserComment', () => {
    it('should send notifications to all user tokens with comment data', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({
            rows: [
                { fcm_token: 'token1', device_type: 'android' },
                { fcm_token: 'token2', device_type: 'ios' },
            ],
        });
        const sendMock = (admin.messaging() as any).send as jest.Mock;
        sendMock.mockResolvedValue(undefined);

        const dto: SendNotificationDto = {
            userId: 'user1',
            title: 'Comment Title',
            body: 'Comment Body',
            name: 'User Name',
            publicationId: 'pub123',
            commentBody: 'Nice post!',
            commentUserId: 'commenter1'
        };
        await pushService.sendNotificationToUserComment(dto);

        expect(sendMock).toHaveBeenCalledTimes(2);
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
            token: 'token1',
            notification: expect.objectContaining({
                title: 'Comment Title',
                body: 'Comment Body'
            }),
            data: expect.objectContaining({
                userId: 'user1',
                title: 'Comment Title',
                body: 'Comment Body',
                publicationId: 'pub123',
                commentBody: 'Nice post!',
                commentUserId: 'commenter1'
            })
        }));
        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
            token: 'token2'
        }));
    });

    it('should handle undefined optional fields safely', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({
            rows: [
                { fcm_token: 'token1', device_type: 'android' }
            ],
        });
        const sendMock = (admin.messaging() as any).send as jest.Mock;
        sendMock.mockResolvedValue(undefined);

        const dto: SendNotificationDto = {
            userId: undefined as any,
            title: 'T',
            body: 'B',
            name: 'N',
            publicationId: undefined as any,
            commentBody: undefined as any,
            commentUserId: undefined as any
        };
        await pushService.sendNotificationToUserComment(dto);

        expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                userId: '',
                publicationId: '',
                commentBody: '',
                commentUserId: ''
            })
        }));
    });

    it('should throw error if user has no tokens', async () => {
        (client.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
        const dto: SendNotificationDto = {
            userId: 'user1',
            title: 'T',
            body: 'B',
            name: 'N',
            publicationId: 'pub',
            commentBody: 'CB',
            commentUserId: 'cuid'
        };
        await expect(pushService.sendNotificationToUserComment(dto)).rejects.toThrow('User does not have any valid FCM tokens');
    });
});


afterAll(async () => {
    await client.end();
});
