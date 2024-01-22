import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from '../common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefiend-to-null.interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('User')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async PostUsers(@Body() joinRequestDto: JoinRequestDto) {
    return await this.usersService.PostUsers(
      joinRequestDto.email,
      joinRequestDto.nickname,
      joinRequestDto.password,
    );
  }

  @ApiOkResponse()
  @ApiResponse({
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login() {}

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout() {}
}
