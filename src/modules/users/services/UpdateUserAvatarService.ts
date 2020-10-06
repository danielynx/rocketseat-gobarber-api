import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import uploadConfig from '@config/upload';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  constructor (private usersRepository: IUsersRepository) {}
  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      try {
        const userAvatarFilePath = path.join(
          uploadConfig.directory,
          user.avatar,
        );

        await fs.promises.unlink(userAvatarFilePath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw new AppError("It wasn't possible change user avatar image.");
        }
      }
    }

    user.avatar = avatarFilename;

    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;
