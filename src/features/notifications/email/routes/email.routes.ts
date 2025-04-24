import { Router } from 'express';
import { sendEmailController, sendRegisterConfirmationController } from '../controllers/email.controller';

const router = Router();

router.post('/send-password-reset', sendEmailController);
router.post('/send-register-confirmation', sendRegisterConfirmationController);
export default router;
