import jwt from 'jsonwebtoken';
import { JwtService } from '../../../src/features/notifications/push/services/jwt.service';

jest.mock('jsonwebtoken');

describe('JwtService', () => {
    const jwtService = new JwtService();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return decoded token if valid', () => {
        const decoded = { id: '123', role: 'admin' };
        (jwt.verify as jest.Mock).mockReturnValueOnce(decoded);

        const result = jwtService.verifyToken('valid-token');
        expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
        expect(result).toBe(decoded);
    });

    it('should throw "Invalid token" if jwt.verify throws', () => {
        (jwt.verify as jest.Mock).mockImplementationOnce(() => {
            throw new Error('jwt malformed');
        });

        expect(() => jwtService.verifyToken('bad-token')).toThrow('Invalid token');
    });
});