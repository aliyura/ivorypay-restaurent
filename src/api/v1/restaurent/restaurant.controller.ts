import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '../../../dtos/ApiResponse.dto';
import { Helpers, Response } from 'src/helpers';

import { AppGuard } from 'src/services/auth/app.guard';
import { RestaurantService } from 'src/services/restaurent/restaurant.service';
import {
  FilterRestaurantDto,
  RestaurantDto,
  RestaurantUpdateDto,
} from 'src/dtos/restaurant.dto';
import { Messages } from 'src/utils/messages/messages';

@Controller('restaurant')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @UseGuards(AppGuard)
  @Post('/')
  async addRestaurant(@Body() requestDto: RestaurantDto): Promise<ApiResponse> {
    const validCordinates = Helpers.validateCordinates(
      requestDto.latitude,
      requestDto.longitude,
    );
    if (!validCordinates)
      return Response.send(HttpStatus.BAD_REQUEST, Messages.InvalidCoordinates);

    const result = await this.restaurantService.addRestaurant(requestDto);
    if (result.success) {
      return Response.send(HttpStatus.CREATED, result.message, result.payload);
    }
    return Response.send(HttpStatus.BAD_REQUEST, result.message);
  }

  @UseGuards(AppGuard)
  @Put('/:id')
  async updateRestaurant(
    @Param('id') id: number,
    @Body() requestDto: RestaurantUpdateDto,
  ): Promise<ApiResponse> {
    const result = await this.restaurantService.updateRestaurant(
      id,
      requestDto,
    );
    if (result.success) {
      return Response.send(HttpStatus.OK, result.message, result.payload);
    }
    return Response.send(HttpStatus.BAD_REQUEST, result.message);
  }

  @UseGuards(AppGuard)
  @Delete('/:id')
  async deleteRestaurant(@Param('id') id: number): Promise<ApiResponse> {
    const result = await this.restaurantService.deleteRestaurant(id);
    if (result.success) {
      return Response.send(HttpStatus.OK, result.message, result.payload);
    }
    return Response.send(HttpStatus.BAD_REQUEST, result.message);
  }

  @Get('/:id')
  async getRestaurant(@Param('id') id: number): Promise<ApiResponse> {
    const result = await this.restaurantService.getRestaurant(id);
    if (result.success) {
      return Response.send(HttpStatus.OK, result.message, result.payload);
    }
    return Response.send(HttpStatus.BAD_REQUEST, result.message);
  }

  @Get('/')
  async getRestaurants(
    @Query('city') city: string,
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('distance') distance: number,
  ): Promise<ApiResponse> {
    const filter = {
      city,
      latitude,
      longitude,
      distance,
    } as FilterRestaurantDto;

    const validCordinates = Helpers.validateCordinates(latitude, longitude);
    if (!validCordinates)
      return Response.send(HttpStatus.BAD_REQUEST, Messages.InvalidCoordinates);
    else if (distance <= 0)
      return Response.send(HttpStatus.BAD_REQUEST, Messages.InvalidDistance);

    console.log(filter);
    const result = await this.restaurantService.getRestaurants(filter);
    if (result.success) {
      return Response.send(HttpStatus.OK, result.message, result.payload);
    }
    return Response.send(HttpStatus.BAD_REQUEST, result.message);
  }
}
