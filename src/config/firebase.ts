import admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

let firebaseAuthInstance = {
  verifyIdToken: async (idToken: string, checkRevoked?: boolean) => ({ uid: 'test-user-id' }),
};

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    
    firebaseAuthInstance = admin.auth();
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.log('Firebase credentials not found, using mock implementation');
  }
} catch (error) {
  console.warn('Error initializing Firebase:', error);
}

export const firebaseAuth = firebaseAuthInstance;