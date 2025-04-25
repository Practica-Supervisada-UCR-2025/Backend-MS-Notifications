import { confirmationRegisterTemplate } from '../../src/utils/confirmationRegisterTemplate';

describe('confirmationRegisterTemplate', () => {
  it('should generate mobile user template with username', () => {
    const template = confirmationRegisterTemplate('mobile', 'John Doe');
    expect(template).toContain('Welcome to UCR Connect, John Doe!');
    expect(template).toContain('UCR Connect Mobile Team');
    expect(template).toContain('Your registration has been completed successfully');
  });

  it('should generate mobile user template without username', () => {
    const template = confirmationRegisterTemplate('mobile');
    expect(template).toContain('Welcome to UCR Connect, New User!');
    expect(template).toContain('UCR Connect Mobile Team');
    expect(template).toContain('Your registration has been completed successfully');
  });

  it('should generate web admin template with username', () => {
    const template = confirmationRegisterTemplate('web', 'Admin User');
    expect(template).toContain('Welcome to UCR Connect Admin Dashboard, Admin User!');
    expect(template).toContain('UCR Connect Administration Team');
    expect(template).toContain('Your administrator account has been successfully activated');
  });

  it('should generate web admin template without username', () => {
    const template = confirmationRegisterTemplate('web');
    expect(template).toContain('Welcome to UCR Connect Admin Dashboard, Administrator!');
    expect(template).toContain('UCR Connect Administration Team');
    expect(template).toContain('Your administrator account has been successfully activated');
  });

  it('should default to mobile template when no userType is provided', () => {
    const template = confirmationRegisterTemplate();
    expect(template).toContain('Welcome to UCR Connect, New User!');
    expect(template).toContain('UCR Connect Mobile Team');
    expect(template).toContain('Your registration has been completed successfully');
  });

  it('should include common HTML elements and styles', () => {
    const template = confirmationRegisterTemplate();
    expect(template).toContain('<div style="');
    expect(template).toContain('font-family: Arial, sans-serif');
    expect(template).toContain('background-color: #f9f9f9');
    expect(template).toContain('<hr style="');
  });
});