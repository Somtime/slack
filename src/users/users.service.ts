import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  PostUsers(email: string, nickname: string, password: string) {
    throw new Error('Method not implemented.');
  }
}
