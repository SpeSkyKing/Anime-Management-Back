import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('regist')
  async registerUser(@Body() userData: {}) {
    return this.userService.registerUser(userData);
  }
  @Post('login')
  async loginUser(@Body() userData: {}) {
    return this.userService.loginUser(userData);
  }
}
