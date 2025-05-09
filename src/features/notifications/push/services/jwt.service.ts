import jwt from 'jsonwebtoken';

export class JwtService {
    private secret = process.env.JWT_SECRET || 'default_secret';

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}