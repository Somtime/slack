import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async findById(id: number) {
    return await this.workspacesRepository.findBy({
      id,
    });
  }

  async findMyWorkspaces(id: number) {
    return await this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: id }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const workspace = queryRunner.manager.getRepository(Workspaces).create({
        name,
        url,
        OwnerId: myId,
      });

      const savedWorkspace = await queryRunner.manager
        .getRepository(Workspaces)
        .save(workspace);

      const channel = queryRunner.manager.getRepository(Channels).create({
        name: '일반',
        WorkspaceId: savedWorkspace.id,
      });

      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create({
          UserId: myId,
          WorkspaceId: savedWorkspace.id,
        });

      const [, savedChannel] = await Promise.all([
        queryRunner.manager
          .getRepository(WorkspaceMembers)
          .save(workspaceMember),
        queryRunner.manager.getRepository(Channels).save(channel),
      ]);

      const channelMember = queryRunner.manager
        .getRepository(ChannelMembers)
        .create({
          UserId: myId,
          ChannelId: savedChannel.id,
        });

      await queryRunner.manager
        .getRepository(ChannelMembers)
        .save(channelMember);

      queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      queryRunner.rollbackTransaction();
    }
  }

  async getWorkspaceMembers(url: string) {
    return await this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'workspaceMembers')
      .innerJoin(
        'workspaceMembers.Workspace',
        'workspace',
        'workspace.url = :url',
        { url },
      )
      .getOne();
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
        url,
      })
      .getOne();
  }
}
