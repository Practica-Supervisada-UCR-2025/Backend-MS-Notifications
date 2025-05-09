import { Request, Response } from 'express';
import { sendNotificationToUser, sendNotificationToAllUsers } from '../services/pushNotification.service';
import { SendNotificationDto } from '../dto/pushNotificationDto';

export const sendNotificationToUserController = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as SendNotificationDto;

    if (!dto.userId || !dto.title || !dto.body) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
    }

    try {
        await sendNotificationToUser(dto);
        res.status(200).json({ message: 'Notification sent to user successfully!' });
    } catch (error) {
        console.error('Failed to send notification to user:', error);
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
        console.error('Failed to send notification to all users:', error);
        res.status(500).json({ message: 'Failed to send notification to all users' });
    }
};