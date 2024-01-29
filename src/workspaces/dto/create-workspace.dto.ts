import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkspaceDto {
  @ApiProperty({
    example: '슬랙',
    description: '워크스페이스명',
  })
  public workspace: string;

  @ApiProperty({
    example: 'slack',
    description: 'url 주소',
  })
  public url: string;
}
