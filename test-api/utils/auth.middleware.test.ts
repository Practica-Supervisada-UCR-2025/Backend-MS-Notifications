import { authenticateJWT, validateAuth, authorizeRoles, AuthenticatedRequest } from '../../src/utils/auth.middleware';
import { UnauthorizedError } from '../../src/utils/apiError';

jest.mock('../../src/features/notifications/push/services/jwt.service', () => ({
    JwtService: jest.fn().mockImplementation(() => ({
        verifyToken: jest.fn((token: string) => {
            if (token === 'valid-admin') return { role: 'admin' };
            if (token === 'valid-moderator') return { role: 'moderator' };
            if (token === 'valid-user') return { role: 'user' };
            return { role: 'unknown' };
        }),
    })),
}));

jest.mock('../../src/config/firebase', () => ({
    firebaseAuth: {
        verifyIdToken: jest.fn((token: string) => {
            if (token === 'valid-firebase') return Promise.resolve({ uid: '123' });
            return Promise.reject();
        }),
    },
}));

describe('authenticateJWT', () => {
    const next = jest.fn();

    it('should attach admin user and call next', () => {
        const req = { headers: { authorization: 'Bearer valid-admin' } } as any;
        const res = {} as any;
        authenticateJWT(req, res, next);
        expect((req as AuthenticatedRequest).user.role).toBe('admin');
        expect(next).toHaveBeenCalledWith();
    });

    it('should attach moderator user and call next', () => {
        const req = { headers: { authorization: 'Bearer valid-moderator' } } as any;
        const res = {} as any;
        authenticateJWT(req, res, next);
        expect((req as AuthenticatedRequest).user.role).toBe('moderator');
        expect(next).toHaveBeenCalledWith();
    });

    it('should attach user role if unknown', () => {
        const req = { headers: { authorization: 'Bearer something-else' } } as any;
        const res = {} as any;
        authenticateJWT(req, res, next);
        expect((req as AuthenticatedRequest).user.role).toBe('user');
        expect(next).toHaveBeenCalledWith();
    });

    it('should throw if no token', () => {
        const req = { headers: {} } as any;
        const res = {} as any;
        const nextMock = jest.fn();
        authenticateJWT(req, res, nextMock);
        expect(nextMock.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });

    it('should throw if invalid format', () => {
        const req = { headers: { authorization: 'invalid' } } as any;
        const res = {} as any;
        const nextMock = jest.fn();
        authenticateJWT(req, res, nextMock);
        expect(nextMock.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });
});

describe('validateAuth', () => {
    const next = jest.fn();

    it('should call next if firebase token is valid', async () => {
        const req = { body: { auth_token: 'valid-firebase' } } as any;
        const res = {} as any;
        await validateAuth(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it('should throw if no auth_token', async () => {
        const req = { body: {} } as any;
        const res = {} as any;
        const nextMock = jest.fn();
        await validateAuth(req, res, nextMock);
        expect(nextMock.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });

    it('should throw if firebase token is invalid', async () => {
        const req = { body: { auth_token: 'invalid' } } as any;
        const res = {} as any;
        const nextMock = jest.fn();
        await validateAuth(req, res, nextMock);
        expect(nextMock.mock.calls[0][0]).toBeInstanceOf(UnauthorizedError);
    });
});

describe('authorizeRoles', () => {
    const next = jest.fn();
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    } as any;

    it('should call next if user role is allowed', () => {
        const req = { user: { role: 'admin' } } as any;
        authorizeRoles('admin', 'moderator')(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if user role is not allowed', () => {
        const req = { user: { role: 'user' } } as any;
        authorizeRoles('admin', 'moderator')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: insufficient permissions' });
    });

    it('should return 403 if user role is missing', () => {
        const req = {} as any;
        authorizeRoles('admin')(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden: insufficient permissions' });
    });
});