import { Resend } from 'resend';

export class EmailSender {
  private resend: Resend;

  constructor() {
    // Initialize Resend with API Key
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOTPEmail(to: string, userName: string, otp: string) {
    try {
      console.log(`Sending OTP email to: ${to}`);

      // Email content (same as your current HTML)
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Parul University Campus Cuisine</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f8f9fa; margin: 0; padding: 20px; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 20px; padding: 20px 0; background-color: #E73B4E; border-radius: 8px 8px 0 0;">
              <img src="https://uploads.sarvgyan.com/2023/03/Parul-Logo.jpeg" alt="Parul University Logo" style="width: 200px; height: 100px; object-fit: contain;">
              <br>
              <div style="background-color: #F6B819; color: white; padding: 5px 10px; border-radius: 4px; display: inline-block; margin: 10px 0; font-weight: bold;">
                NAAC A++ ACCREDITED UNIVERSITY
              </div>
            </div>
            <div style="text-align: center; color: #E73B4E; font-size: 28px; font-weight: 600; margin-bottom: 25px;">
              Welcome to <span style="color: #E73B4E; font-weight: bold;">Parul University</span> Campus Cuisine
            </div>
            <div style="color: #2c3e50; font-size: 16px; margin-bottom: 25px; text-align: left;">
              <p>Dear <strong>${userName}</strong>,</p>
              <p>Thank you for joining <strong>Campus Cuisine</strong>, Parul University's official food ordering platform.
              We're excited to enhance your campus dining experience with our smart ordering system.</p>
            </div>
            <div style="background: #E73B4E; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
              <div style="font-size: 18px;">Verification Code</div>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 10px 0; background: white; color: #E73B4E; padding: 10px; border-radius: 4px;">
                ${otp}
              </div>
              <div>Please use this code to complete your account verification</div>
            </div>
            <div style="background-color: #fff3cd; border-left: 4px solid #F6B819; padding: 10px 15px; margin: 20px 0; font-size: 14px;">
              ⏰ This verification code will expire in 10 minutes for security purposes.
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #F6B819;">
              <h3 style="color: #E73B4E; margin-top: 0;">What's in store for you:</h3>
              <div style="margin: 10px 0; color: #2c3e50;">📊 Real-time crowd monitoring at campus food courts</div>
              <div style="margin: 10px 0; color: #2c3e50;">⚡ Quick and easy digital ordering system</div>
              <div style="margin: 10px 0; color: #2c3e50;">🎯 Exclusive deals for Parul University students</div>
            </div>
            <div style="text-align: center; color: #666; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 5px 0;">&copy; 2025 Parul University Campus Cuisine</p>
              <p style="margin: 5px 0;">Vadodara, Gujarat, India</p>
              <p style="margin: 5px 0;">Making Campus Dining Smarter</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // Send email using Resend
      const result = await this.resend.emails.send({
        from: process.env.MAIL_FROM || 'support@nitintech.dev',  // Use your Resend verified domain
        to: to,
        subject: 'Welcome to Parul University Campus Cuisine - Verify Your Account',
        html: html
      });

      console.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }
}
