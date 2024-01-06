import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Channel')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) {}

  @Get()
  getChannels() {}

  @Post()
  postChannel() {}

  @Get(':name')
  getChannel() {}

  @Get(':name/chats')
  getChat(@Param('name') parameter) {
    const url = parameter.name;
    const id  = parameter.id;
  }

  @Post(':name/chats')
  postChat(@Body() body) {
  }

  @Post(':name/members')
  getMembersFromChannel() {}

  @Post(':name/members')
  inviteMembers() {}
}
