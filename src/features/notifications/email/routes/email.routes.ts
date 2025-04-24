import { Router } from 'express';
import { sendEmailController } from '../controllers/email.controller';

const router = Router();

router.post('/send-password-reset', sendEmailController);

export default router;
