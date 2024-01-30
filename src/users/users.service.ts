import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private dataSource: DataSource,
  ) {}

  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    const user = await queryRunner.manager.getRepository(Users).findOne({
      where: {
        email,
      },
    });

    if (user) throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const savedUser = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: savedUser.id,
        WorkspaceId: 1,
      });

      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: savedUser.id,
        ChannelId: 1,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException('UsersService.join() transaction error', 403);
    } finally {
      await queryRunner.release();
    }

    return true;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email,
      },
      select: ['id', 'email', 'nickname', 'password'],
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
