import { Controller, Delete, Get, Post } from '@nestjs/common';
import { WorkspacesService } from './workspaces.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workspace')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  getWorkspaces() {}

  @Post()
  createWorkspace() {}

  @Get(':url/members')
  getMembersFromWorkspace() {}

  @Post(':url/members')
  inviteMembersToWorkspace() {}

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {}

  @Get(':url/members/:id')
  getMemberInfoInWorkspace() {}
}
