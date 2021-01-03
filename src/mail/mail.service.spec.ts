import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import * as sgMail from '@sendgrid/mail';

jest.mock('@sendgrid/mail');

describe('MailService', () => {
  let service: MailService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: {
            apiKey: 'test api key',
            emailFrom: 'testsender@email.com',
          },
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        to: 'receiver@email.com',
        code: 'code',
      };
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => true);

      service.sendVerificationEmail(
        sendVerificationEmailArgs.to,
        sendVerificationEmailArgs.code,
      );

      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        'test api key',
        'testsender@email.com',
        'receiver@email.com',
        'd-458e2f323245427281dfcc762c7d3241',
        [{ key: 'verificationCode', value: 'code' }],
      );
    });
  });
  describe('sendEmail', () => {
    it('sends email', async () => {
      const emailVars = [
        {
          key: 'verificationCode',
          value: '',
        },
      ];
      const ok = await service.sendEmail('apikey', '', '', '', emailVars);
      jest.spyOn(sgMail, 'setApiKey');
      jest.spyOn(sgMail, 'send');
      expect(sgMail.setApiKey).toHaveBeenCalledWith('apikey');
      expect(sgMail.send).toHaveBeenCalledTimes(1);
      expect(sgMail.send).toHaveBeenCalledWith({
        dynamic_template_data: {
          verificationCode: '',
        },
        from: '',
        templateId: '',
        to: '',
      });
      expect(ok).toBe(true);
      const okNoVars = await service.sendEmail('apikey', '', '', '');
      expect(okNoVars).toBe(true);
    });
    it('fails on error', async () => {
      jest.spyOn(sgMail, 'send').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail('apikey', '', '', '', []);
      expect(ok).toEqual(false);
    });
  });
});
