import { firebaseAuth } from '../../../../config/firebase';
import admin from 'firebase-admin';
import { SendNotificationDto } from '../dto/pushNotificationDto';
import { FmcTokenDTO } from '../dto/fmcToken.dto';
import fs from 'fs';
import { Client } from 'pg';
import client from "../../../../config/database";

const conn = client as Client;

export const sendNotificationToUser = async (dto: SendNotificationDto): Promise<void> => {
    const { userId, title, body, name, publicationId } = dto;

    // Retrieve all FCM tokens for the user from the database
    const query = `
        SELECT fcm_token, device_type
        FROM fcm_tokens
        WHERE user_id = $1
    `;
    const { rows } = await conn.query(query, [userId]);

    if (!rows || rows.length === 0) {
        throw new Error('User does not have any valid FCM tokens');
    }

    for (const row of rows) {
        const fcmToken = row.fcm_token;
        if (!fcmToken) {
            continue;
        }

        // Create data object first
        let messageData: { [key: string]: string } = {
            name: dto.name
        };

        // Add publicationId only if it exists
        if (dto.publicationId) {
            messageData.publicationId = dto.publicationId;
        }

        const message = {
            token: fcmToken,
            notification: {
                title,
                body,
            },
            data: messageData
        };

        try {
            await admin.messaging().send(message);
        } catch (err) {
            console.error(`Failed to send notification to token: ${fcmToken}`, err);
        }
    }
};

export const sendNotificationToAllUsers = async (dto: Omit<SendNotificationDto, 'userId' | 'publicationId'>): Promise<void> => {
    const { title, body } = dto;

    // Retrieve all FCM tokens from the database
    const query = `
        SELECT fcm_token, device_type
        FROM fcm_tokens
    `;
    const { rows } = await conn.query(query);

    if (!rows || rows.length === 0) {
        throw new Error('No FCM tokens found in the database');
    }

    for (const row of rows) {
        const fcmToken = row.fcm_token;
        if (!fcmToken) {
            continue;
        }

        const message = {
            token: fcmToken,
            notification: {
                title,
                body,
            },
            data: {
                name: dto.name,
            }
        };

        try {
            await admin.messaging().send(message);
        } catch (err) {
            console.error(`Failed to send notification to token: ${fcmToken}`, err);
        }
    }
};

export async function saveFmcToken({ fcmToken, deviceType, userId }: FmcTokenDTO) {
    try {
        const { rows } = await conn.query(
            `INSERT INTO fcm_tokens (fcm_token, device_type, user_id) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (fcm_token) 
             DO UPDATE SET device_type = $2, user_id = $3 
             RETURNING *;`,
            [fcmToken, deviceType, userId]
        );
        return rows[0];
    } catch (error) {
        throw error;
    }
}


export const sendNotificationToUserComment = async (dto: SendNotificationDto): Promise<void> => {
    const { userId, title, body, publicationId, commentBody, commentUserId } = dto;

    // Retrieve all FCM tokens for the user from the database
    const query = `
        SELECT fcm_token, device_type
        FROM fcm_tokens
        WHERE user_id = $1
    `;
    const { rows } = await conn.query(query, [userId]);

    if (!rows || rows.length === 0) {
        throw new Error('User does not have any valid FCM tokens');
    }

    for (const row of rows) {
        const fcmToken = row.fcm_token;
        if (!fcmToken) {
            continue;
        }

        // Create data object including all required fields
        let messageData: { [key: string]: string } = {
            userId: dto.userId?.toString() || '',
            title,
            body,
            publicationId: publicationId?.toString() || '',
            commentBody: dto.commentBody || '',
            commentUserId: dto.commentUserId?.toString() || '',
        };

        const message = {
            token: fcmToken,
            notification: {
                title,
                body,
            },
            data: messageData
        };

        try {
            await admin.messaging().send(message);
        } catch (err) {
            console.error(`Failed to send notification to token: ${fcmToken}`, err);
        }
    }
};