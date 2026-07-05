import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const hasConfig = env.EMAIL_USER && env.EMAIL_PASSWORD;
    if (!hasConfig) {
      console.log('Email service: Credentials missing. Operating in CONSOLE mock email mode.');
      return;
    }

    try {
      if (env.EMAIL_SERVICE) {
        this.transporter = nodemailer.createTransport({
          service: env.EMAIL_SERVICE,
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASSWORD,
          },
        });
      } else {
        // Fallback to standard SMTP options if no specific service (e.g. Gmail) is defined
        this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASSWORD,
          },
        });
      }
    } catch (err) {
      console.error('Failed to initialize nodemailer transporter:', err);
    }
  }

  async sendResetPasswordEmail(to: string, resetUrl: string): Promise<boolean> {
    const subject = 'Reset Your Skillfy Password';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
        <h2 style="color: #6366f1; text-align: center;">Reset Your Password</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your Skillfy account. Click the button below to set a new password. This link is valid for 1 hour.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can copy and paste the following link directly into your browser:</p>
        <p style="word-break: break-all; color: #6366f1;">${resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888888;">If you did not request this password reset, please ignore this email.</p>
      </div>
    `;

    if (!this.transporter) {
      console.log('====================================================');
      console.log('MOCK EMAIL SENDING (forgot-password)');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('====================================================');
      return true;
    }

    try {
      await this.transporter.sendMail({
        from: `"Skillfy Support" <${env.EMAIL_USER}>`,
        to,
        subject,
        html: htmlContent,
      });
      return true;
    } catch (err) {
      console.error(`Failed to send password reset email to ${to}:`, err);
      // Fallback logging
      console.log('============================ FALLBACK LINK ============================');
      console.log(`Failed to send email. Active fallback Reset URL: ${resetUrl}`);
      console.log('=======================================================================');
      return false;
    }
  }
}

export const emailService = new EmailService();
