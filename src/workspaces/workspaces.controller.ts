import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('Workspace')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  async getWorkspaces(@User() user: Users) {
    return await this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  async createWorkspace(
    @User() user: Users,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return await this.workspacesService.createWorkspace(
      createWorkspaceDto.workspace,
      createWorkspaceDto.url,
      user.id,
    );
  }

  @Get(':url/members')
  async getWorkspaceMembers(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body('email') email,
  ) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  @Get(':url/members/:id')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }

  @Get(':url/users/:id')
  async DEPRECATED_getWorkspaceUser(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
