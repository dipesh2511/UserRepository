const getResetEmailTemplate = (resetLink) => {
    return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Reset Your Password</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <table width="100%" cellspacing="0" cellpadding="0">
      <tr>
        <td align="center">
          <table style="max-width: 600px; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
            <tr>
              <td style="text-align: center;">
                <h2 style="color: #333;">Reset Your Password</h2>
                <p style="color: #555;">We received a request to reset your password. Click the button below to proceed.</p>
                <a href="${resetLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
                <p style="margin-top: 30px; font-size: 14px; color: #999;">
                  This link will expire in 5 minutes. If you didn’t request a password reset, you can ignore this email.
                </p>
                <p style="font-size: 13px; color: #999;">
                  — Your App Team
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
  };
  
  export default getResetEmailTemplate;
  