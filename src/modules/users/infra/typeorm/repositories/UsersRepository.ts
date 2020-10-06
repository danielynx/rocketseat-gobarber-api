import { getRepository, Repository } from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository  from "@modules/users/repositories/IUsersRepository";
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

class UsersRepository implements IUsersRepository {
  private ormRepository:Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    return await this.ormRepository.findOne(id);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({
      where: { email },
    });
  }

  public async create(data: ICreateUserDTO):Promise<User> {
    const user = this.ormRepository.create(data);

    return await this.ormRepository.save(user);
  }

  public async update(user: User):Promise<User> {
    return await this.ormRepository.save(user);
  }

}

export default UsersRepository;
