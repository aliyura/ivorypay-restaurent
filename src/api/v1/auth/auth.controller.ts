import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UserAuthDto } from 'src/dtos';
import { AuthService } from '../../../services/auth/auth.service';
import { ApiResponse } from 'src/dtos/ApiResponse.dto';
import { Response } from 'src/helpers';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async authenticateUser(
    @Body() requestDto: UserAuthDto,
  ): Promise<ApiResponse> {
    const result = await this.authService.login(requestDto);
    console.log(result);
    if (result.success && result.payload) {
      return Response.send(HttpStatus.OK, result.message, result.payload);
    }
    return Response.send(HttpStatus.UNAUTHORIZED, result.message);
  }
}
