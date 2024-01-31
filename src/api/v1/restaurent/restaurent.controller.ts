import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse } from '../../../dtos/ApiResponse.dto';
import { RestaurentDto } from 'src/dtos/restaurent.dto';

@Controller('restaurent')
export class RestaurentController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  // @Post('/')
  // async addRestaurent(
  //   @Body() requestDto: RestaurentDto,
  // ): Promise<ApiResponse> {}
}
