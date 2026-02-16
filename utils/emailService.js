const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

const sendOTPEmail = async (email, otp, fullName, role) => {
  let roleMessage = '';
  let roleColor = '#667eea';
  let roleIcon = '🚀';
  
  if (role === 'investor') {
    roleMessage = 'Welcome to our investment community! Verify your email to discover innovative startups and investment opportunities.';
    roleColor = '#10b981';
    roleIcon = '💼';
  } else if (role === 'startup_owner') {
    roleMessage = 'Welcome to our startup ecosystem! Verify your email to launch your campaign and connect with potential investors.';
    roleColor = '#f59e0b';
    roleIcon = '🚀';
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - Crowdfunding Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, ${roleColor} 0%, #764ba2 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">${roleIcon} Email Verification</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Hello ${fullName}!</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      ${roleMessage}
                    </p>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      Please use the verification code below to complete your registration:
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px dashed ${roleColor};">
                          <div style="font-size: 36px; font-weight: bold; color: ${roleColor}; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                      This code will expire in ${process.env.OTP_EXPIRY_MINUTES} minutes
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; font-size: 13px; margin: 0; line-height: 1.5;">
                      If you didn't create an account, please ignore this email.<br>
                      This is an automated message, please do not reply.
                    </p>
                    <p style="color: #cccccc; font-size: 12px; margin: 15px 0 0 0;">
                      © 2024 Crowdfunding Platform. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send OTP email' };
  }
};

const sendResetPasswordOTP = async (email, otp, fullName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - Crowdfunding Platform',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">🔐 Password Reset</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 40px 30px;">
                    <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Hello ${fullName},</h2>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      We received a request to reset your password. Use the verification code below to proceed with resetting your password.
                    </p>
                    <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                      <strong>Security Code:</strong>
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="padding: 20px; background-color: #fef2f2; border-radius: 8px; border: 2px dashed #ef4444;">
                          <div style="font-size: 36px; font-weight: bold; color: #ef4444; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                            ${otp}
                          </div>
                        </td>
                      </tr>
                    </table>
                    <p style="color: #999999; font-size: 14px; margin: 20px 0 0 0; text-align: center;">
                      This code will expire in ${process.env.OTP_EXPIRY_MINUTES} minutes
                    </p>
                    <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 30px; border-radius: 4px;">
                      <p style="color: #856404; font-size: 14px; margin: 0; line-height: 1.5;">
                        <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
                      </p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="color: #999999; font-size: 13px; margin: 0; line-height: 1.5;">
                      This is an automated security message, please do not reply.<br>
                      Need help? Contact our support team.
                    </p>
                    <p style="color: #cccccc; font-size: 12px; margin: 15px 0 0 0;">
                      © 2024 Crowdfunding Platform. All rights reserved.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'OTP sent successfully' };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, message: 'Failed to send OTP email' };
  }
};

module.exports = { sendOTPEmail, sendResetPasswordOTP };
