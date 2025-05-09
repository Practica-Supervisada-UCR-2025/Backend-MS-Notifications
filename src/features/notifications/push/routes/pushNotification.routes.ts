import express from 'express';
import { authenticateJWT } from '../../../../utils/auth.middleware';
import {
    sendNotificationToUserController,
    sendNotificationToAllUsersController,
} from '../controllers/pushNotification.controller';

const router = express.Router();

// Test route to verify authentication
router.get('/test-auth', authenticateJWT, (req, res) => {
    const user = (req as any).user; // Temporary workaround
    res.status(200).json({ message: 'Authentication successful!', user });
});

router.post('/send-to-user', authenticateJWT, sendNotificationToUserController);
router.post('/send-to-all', authenticateJWT, sendNotificationToAllUsersController);

export default router;