import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import * as sgMail from '@sendgrid/mail';
@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  message = {
    to: 'rivoltafilippo@gmail.com', // Change to your recipient
    from: 'rivoltafilippo@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  async sendEmail() {
    sgMail.setApiKey(this.options.apiKey);
    sgMail
      .send(this.message)
      .then(() => {
        console.log('Email sent');
        return true;
      })
      .catch((error) => {
        console.error(error);
        return false;
      });
  }

  sendVerificationEmail() {
    this.sendEmail();
  }
}
