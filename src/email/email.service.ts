import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async welcomeEmail(data) {
    const { username } = data;

    const subject = `Welcome to Company: ${username}`;

    await this.mailerService.sendMail({
      to: username,
      subject,
      template: './welcome',
      context: {
        username,
      },
    });
  }
}
