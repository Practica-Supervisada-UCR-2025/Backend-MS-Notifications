import express from 'express';
import { authenticateJWT, authorizeRoles } from '../../../../utils/auth.middleware';
import { registerFmcToken } from '../controllers/pushNotification.controller';
import {
    sendNotificationToUserController,
    sendNotificationToAllUsersController,
} from '../controllers/pushNotification.controller';

const router = express.Router();

// Route to register FCM token
// This route is protected and requires authentication
router.post(
    '/register-fmc-token',
    authenticateJWT,
    authorizeRoles('admin', 'moderator', 'user'),
    registerFmcToken
);

router.post('/send-to-user', authenticateJWT, authorizeRoles('admin', 'moderator'), sendNotificationToUserController);
router.post('/send-to-all', authenticateJWT, authorizeRoles('admin', 'moderator'), sendNotificationToAllUsersController);

export default router;