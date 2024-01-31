import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from 'src/dtos';
import { Helpers } from 'src/helpers';
import { UserService } from 'src/services/user/user.service';
import { ApiResponse } from '../../../dtos/ApiResponse.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async createUser(@Body() requestDto: UserDto): Promise<ApiResponse> {
    const response = await this.userService.createUser(requestDto);
    if (response.success) {
      return response;
    }
    return Helpers.response(HttpStatus.BAD_REQUEST, response.message);
  }
}
