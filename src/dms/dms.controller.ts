import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DmsService } from './dms.service';
import { CreateDmDto } from './dto/create-dm.dto';
import { UpdateDmDto } from './dto/update-dm.dto';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspaces/:url/dms')
export class DmsController {
  constructor(private readonly dmsService: DmsService) {}

  @ApiParam({
    name: 'url',
    description: '워크스페이스 url',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: '사용자 아이디',
    required: true,
  })
  @ApiQuery({
    name: 'perPage',
    description: '한 번에 가져오는 개수',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: '불러올 페이지',
    required: true,
  })
  @Get(':id/chats')
  getChat(@Param() param, @Query() query) {
    const url = param.url;
    const id = param.id;

    const perPage = query.perPage;
    const page = query.page;

    console.log(url, id, perPage, page);
  }

  @Post(':id/chats')
  postChat(@Body() body) {}
}
