import { SendPasswordResetEmailDto } from '../../../src/features/notifications/email/dto/SendPasswordResetEmailDto';
import { validate } from 'class-validator';

describe('SendPasswordResetEmailDto', () => {
  it('should pass validation with valid fields', async () => {
    const dto = new SendPasswordResetEmailDto();
    dto.email = 'user@example.com';
    dto.recoveryLink = 'https://example.com/reset';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation with invalid email', async () => {
    const dto = new SendPasswordResetEmailDto();
    dto.email = 'not-an-email';
    dto.recoveryLink = 'https://example.com/reset';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail validation when recoveryLink is missing', async () => {
    const dto = new SendPasswordResetEmailDto();
    dto.email = 'user@example.com';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('recoveryLink');
  });
});
