import { Controller, Get, HttpStatus, Redirect } from '@nestjs/common';
import { ApiResponse } from 'src/dtos/ApiResponse.dto';
import { Response } from 'src/helpers';

@Controller()
export class AppController {
  @Get('/docs')
  @Redirect('https://documenter.getpostman.com/view/10509620/2s9Yyv9eaw')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  getDocs(): void {}

  @Get('/ping')
  async ping(): Promise<ApiResponse> {
    return Response.send(
      HttpStatus.OK,
      'Ivorypay restaurant service is up and running...',
    );
  }
}
