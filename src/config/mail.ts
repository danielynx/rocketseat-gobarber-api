interface IMailConfig {
  driver: 'ethereal' | 'ses';
  defaults: {
    from: {
      name: string;
      email: string;
    };
  };
  config: {
    ethereal: {};
    ses: {
      region: string;
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
  config: {
    ethereal: {},
    ses: {
      region: 'us-east-1',
    },
  },
} as IMailConfig;
