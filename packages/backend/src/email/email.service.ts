import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(public configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('email_host'),
      port: this.configService.get('email_port'),
      secure: true,
      auth: {
        user: this.configService.get('email_user'),
        pass: this.configService.get('email_auth_password'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('email_user'),
      },
      to,
      subject,
      html,
    });
  }
}
