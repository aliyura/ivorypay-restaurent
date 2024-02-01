import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserDto } from 'src/dtos';
import { UserService } from 'src/services/user/user.service';
import { ApiResponse } from '../../../dtos/ApiResponse.dto';
import { Response } from 'src/helpers';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/')
  async createUser(@Body() requestDto: UserDto): Promise<ApiResponse> {
    const result = await this.userService.createUser(requestDto);
    if (result.success) {
      return result;
    }
    return Response.send(HttpStatus.BAD_REQUEST, result.message);
  }
}
