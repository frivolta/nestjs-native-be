import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions } from './mail.interfaces';
import * as sgMail from '@sendgrid/mail';

interface EmailVarTag {
  key: string;
  value: string;
}

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  async sendEmail(
    apiKey: string,
    from: string,
    to: string,
    templateId: string,
    emailVars?: EmailVarTag[],
  ) {
    const composedMessage = { to, from, templateId, dynamic_template_data: {} };
    if (emailVars) {
      emailVars.forEach((emailVar) => {
        composedMessage.dynamic_template_data[emailVar.key] = emailVar.value;
      });
    }
    try {
      sgMail.setApiKey(apiKey);
      await sgMail.send(composedMessage);
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async sendVerificationEmail(to: string, code: string) {
    const emailVars: EmailVarTag[] = [
      {
        key: 'verificationCode',
        value: code,
      },
    ];
    const templateId = 'd-458e2f323245427281dfcc762c7d3241';
    await this.sendEmail(
      this.options.apiKey,
      this.options.emailFrom,
      to,
      templateId,
      emailVars,
    );
  }
}
