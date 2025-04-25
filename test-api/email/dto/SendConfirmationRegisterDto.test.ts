import { validate } from 'class-validator';
import { SendConfirmationRegisterDto } from '../../../src/features/notifications/email/dto/SendConfirmationRegisterDto';

describe('SendConfirmationRegisterDto', () => {
  it('should pass validation with valid mobile user data', async () => {
    const dto = new SendConfirmationRegisterDto();
    dto.email = 'test@example.com';
    dto.full_name = 'Test User';
    dto.userType = 'mobile';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with valid web user data', async () => {
    const dto = new SendConfirmationRegisterDto();
    dto.email = 'admin@example.com';
    dto.full_name = 'Admin User';
    dto.userType = 'web';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new SendConfirmationRegisterDto();
    dto.email = 'invalid-email';
    dto.full_name = 'Test User';
    dto.userType = 'mobile';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation with missing required fields', async () => {
    const dto = new SendConfirmationRegisterDto();

    const errors = await validate(dto);
    expect(errors.length).toBe(3); // email, full_name, and userType are required
  });

  it('should fail validation with invalid userType', async () => {
    const dto = new SendConfirmationRegisterDto();
    dto.email = 'test@example.com';
    dto.full_name = 'Test User';
    (dto as any).userType = 'invalid';

    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('userType');
  });
});