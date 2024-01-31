import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserAuthDto } from 'src/dtos';
import { Helpers } from 'src/helpers';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponse } from 'src/dtos/ApiResponse.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async authenticateUser(
    @Body() requestDto: UserAuthDto,
  ): Promise<ApiResponse> {
    const response = await this.authService.login(requestDto);
    if (response.success && response.payload) {
      const user = response.payload.info;
      response.payload.info = user;
      return response;
    }
    return Helpers.response(HttpStatus.UNAUTHORIZED, response.message);
  }
}
