import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../features/notifications/push/services/jwt.service';
import { UnauthorizedError } from './apiError';
import { firebaseAuth } from '../config/firebase'; // Corrected import

export interface AuthenticatedRequest extends Request {
    user: {
        role: string;
    };
}

// Middleware to authenticate JWT tokens
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedError('No token provided');
        }

        if (!authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
            throw new UnauthorizedError('Invalid token format');
        }

        const token = authHeader.split('Bearer ')[1];

        const jwtService = new JwtService();
        const decoded = jwtService.verifyToken(token);

        // Validate and set role to either 'user' or 'admin'
        const validRole = decoded.role === 'admin' ? 'admin' : 'user';

        // Attach the user role to the request object
        (req as AuthenticatedRequest).user = {
            role: validRole,
        };

        next();
    } catch (error) {
        next(error);
    }
};

// Middleware to validate Firebase tokens
export const validateAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { auth_token } = req.body;

        if (!auth_token) {
            throw new UnauthorizedError('Unauthorized', ['No auth token provided']);
        }

        await firebaseAuth
            .verifyIdToken(auth_token)
            .catch(() => {
                throw new UnauthorizedError('Unauthorized', ['Invalid auth token']);
            });

        next();
    } catch (error) {
        next(error);
    }
};