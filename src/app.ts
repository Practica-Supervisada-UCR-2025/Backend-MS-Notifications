import express from 'express';
import dotenv from 'dotenv';
import emailRoutes from './features/notifications/email/routes/email.routes';

dotenv.config();
export const app = express();
app.use(express.json());

app.use('/api/email', emailRoutes);

app.listen(3001, () => {
  console.log('MS-Notification running on http://localhost:3001');
});