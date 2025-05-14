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
    authorizeRoles('admin'),
    registerFmcToken
);

router.post('/send-to-user', authenticateJWT, authorizeRoles('admin'), sendNotificationToUserController);
router.post('/send-to-all', authenticateJWT, authorizeRoles('admin'), sendNotificationToAllUsersController);

export default router;