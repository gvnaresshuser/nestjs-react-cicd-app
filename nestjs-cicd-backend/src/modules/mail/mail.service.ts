import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: Transporter; // ✅ FIX

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.config.get('mail.user'),
        pass: this.config.get('mail.pass'),
      },
      tls: {
        rejectUnauthorized: false, // ✅ FIX
      },
    });
  }

  async sendMail(to: string, subject: string, text: string) {
    console.log('MAIL USER:', this.config.get('mail.user'));
    console.log('MAIL PASS:', this.config.get('mail.pass'));
    return this.transporter.sendMail({
      from: this.config.get('mail.user'),
      to,
      subject,
      text,
    });
  }
}
/*
This disables SSL validation (ONLY for dev)

🧠 BETTER (PRODUCTION-SAFE FIX)

Instead of service: gmail, use full config:

this.transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: this.config.get('mail.user'),
    pass: this.config.get('mail.pass'),
  },
  tls: {
    rejectUnauthorized: false,
  },
});
*/
