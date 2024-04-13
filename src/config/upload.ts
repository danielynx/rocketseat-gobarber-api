import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  driver: 's3' | 'disk';
  tmpFolder: string;
  uploadsFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    disk: {
      url: string;
    };
    s3: {
      region: string;
      bucket: string;
      url: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER || 'disk',
  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {
      url: `${process.env.APP_API_URL}/files`,
    },
    s3: {
      region: 'us-east-1',
      bucket: 'app-gobarber-danielynx',
      url: 'https://app-gobarber-danielynx.s3.amazonaws.com',
    },
  },
} as IUploadConfig;
