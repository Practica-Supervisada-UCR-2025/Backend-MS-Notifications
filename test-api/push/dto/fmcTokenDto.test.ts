import { FmcTokenDTO } from '../../../src/features/notifications/push/dto/fmcToken.dto';

describe('FmcTokenDTO', () => {
    it('should create a valid FmcTokenDTO object', () => {
        const dto: FmcTokenDTO = {
            fcmToken: 'token123',
            deviceType: 'android',
            userId: 42,
        };
        expect(dto.fcmToken).toBe('token123');
        expect(dto.deviceType).toBe('android');
        expect(dto.userId).toBe(42);
    });

    it('should fail if required fields are missing', () => {
        const dto = {} as FmcTokenDTO;
        expect(dto.fcmToken).toBeUndefined();
        expect(dto.deviceType).toBeUndefined();
        expect(dto.userId).toBeUndefined();
    });
});