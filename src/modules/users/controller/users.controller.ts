import { Body, Controller, Post } from '@nestjs/common';
import { UsersServices } from '../services/users.services';
import { CreateUserDto } from '../dtos/create-user-request';
import { User } from '../entity/user.entity';
import { SignInDto } from '../dtos/sign-in-request';
import { SignInResponse } from '../dtos/sign-in-response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersServices) {}

  @Post()
  async createUser(@Body() data: CreateUserDto): Promise<User> {
    return await this.usersServices.createUser(data);
  }

  @Post('/signIn')
  async signIn(@Body() data: SignInDto): Promise<SignInResponse> {
    return await this.usersServices.signIn(data);
  }
}
