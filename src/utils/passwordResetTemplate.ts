export function passwordResetTemplate(recoveryLink: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Hello There!,</h2>
        <p style="font-size: 16px; color: #555;">
          We received a request to reset your password. Click the button below to choose a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${recoveryLink}" style="background-color:rgb(41, 67, 95); color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
            Reset Password
          </a>
        </div>
        <p style="font-size: 14px; color: #888;">
          If you didn’t request this, you can safely ignore this email.
        </p>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
        <p style="font-size: 12px; color: #aaa;">
          — UCR Connect Team
        </p>
      </div>
    `;
  }