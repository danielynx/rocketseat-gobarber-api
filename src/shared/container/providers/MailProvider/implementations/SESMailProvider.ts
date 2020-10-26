import nodemailer, { SendMailOptions } from 'nodemailer';
import aws from 'aws-sdk';
import { injectable, inject } from 'tsyringe';

import mailconfig from '@config/mail';
import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class SESMailProvider implements IMailProvider {
  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) { }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailconfig.defaults.from;

    const message: SendMailOptions = {
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    };

    return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
        SES: new aws.SES({
          apiVersion: '2010-12-01',
          region: 'eu-west-2',
        }),
      });

      transporter.sendMail(message, err => {
        if (err) {
          console.log(`Error occurred: ${err.message}`);
          reject();
        }

        resolve();
      });
    });
  }
}
