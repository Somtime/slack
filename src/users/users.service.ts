import { HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async PostUsers(email: string, nickname: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
    });

    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자압니다.');
    }

    await this.usersRepository.save({
      email,
      nickname,
      password,
    });

    return user;
  }
}
