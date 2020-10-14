import nodemailer from 'nodemailer';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

export default class EtherealMailProvider implements IMailProvider {
  public async sendMail(to: string, body: string): Promise<void> {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error(`Failed to create a testing account. ${err.message}`);
        return process.exit(1);
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

      const message = {
        from: 'Equipe GoBarber <equipe@gobarber.com.br>',
        to,
        subject: 'Recuperação de senha',
        text: body,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log(`Error occurred. ${err.message}`);
          return process.exit(1);
        }

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    });
  }
}
