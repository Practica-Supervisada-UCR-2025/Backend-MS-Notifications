import { firebaseAuth } from '../../../../config/firebase';
import admin from 'firebase-admin';
import { SendNotificationDto } from '../dto/pushNotificationDto';

export const sendNotificationToUser = async (dto: SendNotificationDto): Promise<void> => {
    const { userId, title, body } = dto;

    // Retrieve the user's FCM token from Firebase Authentication or your database
    const userRecord = await firebaseAuth.getUser(userId!);
    const fcmToken = userRecord.customClaims?.fcmToken; // Assuming FCM token is stored in custom claims

    if (!fcmToken) {
        throw new Error('User does not have a valid FCM token');
    }

    const message = {
        token: fcmToken,
        notification: {
            title,
            body,
        },
    };

    await admin.messaging().send(message);
};

export const sendNotificationToAllUsers = async (dto: Omit<SendNotificationDto, 'userId'>): Promise<void> => {
    const { title, body } = dto;

    const message = {
        topic: 'all', // Assuming all users are subscribed to the 'all' topic
        notification: {
            title,
            body,
        },
    };

    await admin.messaging().send(message);
};