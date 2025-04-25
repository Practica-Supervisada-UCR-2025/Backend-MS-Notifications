// User types for registration confirmation
type UserType = 'mobile' | 'web';

// Main template function that determines which template to use
export function confirmationRegisterTemplate(
  userType: UserType = 'mobile',
  userName: string = ''
): string {
  switch (userType) {
    case 'web':
      return adminConfirmationTemplate(userName);
    default:
      return userConfirmationTemplate(userName);
  }
}

// Template for mobile users
function userConfirmationTemplate(userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #f9f9f9;">
      <h2 style="color: rgb(41, 67, 95);">Welcome to UCR Connect, ${userName || 'New User'}!</h2>
      <p style="font-size: 16px; color: #555;">
        Your registration has been completed successfully. Thank you for joining our community!
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        — UCR Connect Mobile Team
      </p>
    </div>
  `;
}

// Template for web admins
function adminConfirmationTemplate(userName: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #f9f9f9;">
      <h2 style="color: rgb(41, 67, 95);">Welcome to UCR Connect Admin Dashboard, ${userName || 'Administrator'}!</h2>
      <p style="font-size: 16px; color: #555;">
        Your administrator account has been successfully activated.
      </p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="font-size: 12px; color: #aaa; text-align: center;">
        — UCR Connect Administration Team
      </p>
    </div>
  `;
}