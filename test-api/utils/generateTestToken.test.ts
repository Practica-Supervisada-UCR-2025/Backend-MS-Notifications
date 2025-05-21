import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export function generateTestToken({
    role = 'admin',
    id = '123',
    secret = process.env.JWT_SECRET || 'default_secret',
    expiresIn = '1h'
}: {
    role?: string;
    id?: string;
    secret?: Secret;
    expiresIn?: string | number;
} = {}): string {
    const validRole = ['admin', 'moderator', 'user'].includes(role) ? role : 'admin';
    const payload = { id, role: validRole };
    const options: SignOptions = {};
    if (typeof expiresIn === 'string' || typeof expiresIn === 'number') {
        options.expiresIn = expiresIn as any;
    }
    return jwt.sign(payload, secret, options);
}

describe('generateTestToken', () => {
    it('should generate a valid JWT with the correct payload', () => {
        const token = generateTestToken({ role: 'admin', id: 'test-id', secret: 'mysecret', expiresIn: '1h' });
        const decoded = jwt.verify(token, 'mysecret') as any;
        expect(decoded).toMatchObject({ id: 'test-id', role: 'admin' });
    });

    it('should default to admin role if role is invalid', () => {
        const token = generateTestToken({ role: 'invalid', id: 'test-id', secret: 'mysecret' });
        const decoded = jwt.verify(token, 'mysecret') as any;
        expect(decoded.role).toBe('admin');
    });
});