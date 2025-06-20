import { Request, Response } from 'express';
import { sendNotificationToUser, sendNotificationToAllUsers, sendNotificationToUserComment } from '../services/pushNotification.service';
import { SendNotificationDto } from '../dto/pushNotificationDto';
import * as pushService from '../services/pushNotification.service';


export async function registerFmcToken(req: Request, res: Response): Promise<void> {
    const { fcmToken, deviceType, userId } = req.body;

    if (!fcmToken || !deviceType || !userId) {
        res.status(400).json({ message: 'All fields are required' });
        return;
    }

    try {
        const result = await pushService.saveFmcToken({ fcmToken, deviceType, userId });
        res.status(201).json(result);
    } catch (error: any) {
        res.status(500).json({ message: 'Error saving FMC token', error: error.message });
    }
}


export const sendNotificationToUserController = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as SendNotificationDto;

    if (!dto.userId || !dto.title || !dto.body || !dto.name || !dto.publicationId) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        await sendNotificationToUser(dto);
        res.status(200).json({ message: 'Notification sent to user successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notification to user' });
    }
};

export const sendNotificationToAllUsersController = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as Omit<SendNotificationDto, 'userId'>;

    if (!dto.title || !dto.body) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        await sendNotificationToAllUsers(dto);
        res.status(200).json({ message: 'Notification sent to all users successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notification to all users' });
    }
};

export const sendNotificationToUserCommentController = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as SendNotificationDto;

    if (!dto.userId || !dto.publicationId || !dto.commentBody || !dto.commentUserId || !dto.title || !dto.body) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        await sendNotificationToUserComment(dto);
        res.status(200).json({ message: 'Notification sent to user successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notification to user' });
    }
};