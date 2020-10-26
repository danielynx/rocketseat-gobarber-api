interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  defaults: {
    from: {
      name: process.env.MAIL_DEFAULT_FROM_NAME,
      email: process.env.MAIL_DEFAULT_FROM_EMAIL,
    },
  },
} as IMailConfig;
