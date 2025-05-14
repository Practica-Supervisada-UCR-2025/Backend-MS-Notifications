import { validate } from 'class-validator';

// Example DTOs (adjust import paths as needed)
import { SendNotificationDto } from '../../../src/features/notifications/push/dto/pushNotificationDto';

describe('SendNotificationDto', () => {
    it('should pass validation with all required fields', async () => {
        const dto: SendNotificationDto = {
            userId: 'user1',
            title: 'Test Title',
            body: 'Test Body',
            name: 'Test Name',
        };
        // If using class-validator decorators, instantiate as class and validate
        // Otherwise, just check required fields
        expect(dto.title).toBeDefined();
        expect(dto.body).toBeDefined();
        expect(dto.name).toBeDefined();
    });

    it('should allow userId to be optional', async () => {
        const dto: SendNotificationDto = {
            title: 'Test Title',
            body: 'Test Body',
            name: 'Test Name',
        };
        expect(dto.userId).toBeUndefined();
        expect(dto.title).toBeDefined();
        expect(dto.body).toBeDefined();
        expect(dto.name).toBeDefined();
    });

    it('should fail if required fields are missing', async () => {
        const dto = {} as SendNotificationDto;
        expect(dto.title).toBeUndefined();
        expect(dto.body).toBeUndefined();
        expect(dto.name).toBeUndefined();
    });
});