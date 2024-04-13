import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import routes from '@shared/infra/http/routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(rateLimiter); // After files to not limit files request
app.get('/', (request: Request, response: Response) => response.json({ 'API': 'GoBarber' }));
app.use(routes);

app.use(errors());
app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  console.error(err);

  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3333, () => {
  console.log('🚀️ Server started on port 3333! 🤑️😎️');
});
