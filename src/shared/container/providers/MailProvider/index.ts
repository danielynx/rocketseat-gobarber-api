import { container } from 'tsyringe';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import EtherealMailProvider from '@shared/container/providers/MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '@shared/container/providers/MailProvider/implementations/SESMailProvider';

import mailConfig from '@config/mail';

const providers = {
  ethereal: EtherealMailProvider,
  ses: SESMailProvider,
};

container.registerSingleton<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver],
);
