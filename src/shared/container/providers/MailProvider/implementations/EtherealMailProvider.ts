import nodemailer, { SendMailOptions } from 'nodemailer';
import { injectable, inject } from 'tsyringe';

import ISendMailDTO from '@shared/container/providers/MailProvider/dtos/ISendMailDTO';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider';

@injectable()
export default class EtherealMailProvider implements IMailProvider {
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
    return new Promise((resolve, reject) => {
      nodemailer.createTestAccount(async (err, account) => {
        if (err) {
          console.error(`Failed to create a testing account. ${err.message}`);
          reject();
        }

        console.log('Credentials obtained, sending message...');

        // Create a SMTP transporter object
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        const message: SendMailOptions = {
          from: {
            name: from?.name || 'Equipe GoBarber',
            address: from?.email || 'equipe@gobarber.com.br',
          },
          to: {
            name: to.name,
            address: to.email,
          },
          subject,
          html: await this.mailTemplateProvider.parse(templateData),
        };

        transporter.sendMail(message, (err, info) => {
          if (err) {
            console.log(`Error occurred. ${err.message}`);
            reject();
          }

          console.log('Message sent: %s', info.messageId);
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
          resolve();
        });
      });
    });
  }
}
