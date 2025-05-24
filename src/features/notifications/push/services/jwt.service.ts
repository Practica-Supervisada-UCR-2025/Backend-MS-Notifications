import jwt from 'jsonwebtoken';

export class JwtService {
    private secret = process.env.JWT_SECRET || 'default_secret';

    verifyToken(token: string): any {
        try {
            const decoded = jwt.verify(token, this.secret);
            return decoded;
        } catch (error) {
            if (error instanceof Error) {
            } else {
            }
            throw new Error('Invalid token');
        }
    }
}