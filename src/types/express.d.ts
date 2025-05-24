import 'express';

declare global {
    namespace Express {
        interface Request {
            user?: any; // Add the `user` property to the Request interface
        }
    }
}

