import express from 'express';
import dotenv from 'dotenv';
import emailRoutes from './features/notifications/email/routes/email.routes';
import pushNotificationRoutes from './features/notifications/push/routes/pushNotification.routes';
import client from './config/database';

dotenv.config();
export const app = express();
app.use(express.json());

app.use('/api/email', emailRoutes);
app.use('/api/push-notifications', pushNotificationRoutes);

// Only start server and connect to DB if run directly (not when imported in tests)
if (require.main === module) {
  client.connect()
    .then(() => {
      console.log("Conexión exitosa a PostgreSQL");
      app.listen(3001, () => {
        console.log('MS-Notification running on http://localhost:3001');
      });
    })
    .catch((err) => {
      console.error("Error de conexión:", err);
      process.exit(1);
    });
}

