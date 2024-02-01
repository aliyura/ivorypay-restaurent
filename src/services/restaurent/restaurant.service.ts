import { Injectable } from '@nestjs/common';
import { ApiResponse } from '../../dtos/ApiResponse.dto';
import * as NodeCache from 'node-cache';
import { Messages } from 'src/utils/messages/messages';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Response } from 'src/helpers';
import { Restaurant } from 'src/schemas/restaurant.schema';
import {
  FilterRestaurantDto,
  RestaurantDto,
  RestaurantUpdateDto,
} from 'src/dtos/restaurant.dto';
import { GeoService } from '../geo/geo.service';

@Injectable()
export class RestaurantService {
  cache = new NodeCache();
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepo: Repository<Restaurant>,
    private geoService: GeoService,
  ) {}

  async addRestaurant(requestDto: RestaurantDto): Promise<ApiResponse> {
    try {
      const restaurantExist = await this.restaurantRepo.findOne({
        where: { name: requestDto.name },
      });
      if (restaurantExist)
        return Response.failure(Messages.RestaurantAlreadyExist);

      const response = await this.geoService.reverseCoordinates(
        requestDto.latitude,
        requestDto.longitude,
      );
      if (response.success) {
        const locationData = response.payload;

        const request = {
          ...requestDto,
          city: locationData.city,
        } as Restaurant;

        const created = await this.restaurantRepo.save(request);
        if (created) {
          return Response.success(created);
        } else {
          return Response.failure(Messages.UnableToAddRestaurant);
        }
      } else {
        return Response.failure(Messages.UnableToDetermineLocation);
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }

  async updateRestaurant(
    id: number,
    requestDto: RestaurantUpdateDto,
  ): Promise<ApiResponse> {
    try {
      const restaurant = await this.restaurantRepo.findOne({
        where: { id },
      });
      if (!restaurant) return Response.failure(Messages.RestaurantNotFound);

      const updated = await this.restaurantRepo.update(id, requestDto);
      if (updated && updated.affected > 0) {
        const updatedData = await this.restaurantRepo.findOne({
          where: { id },
        });
        return Response.success(updatedData);
      } else {
        return Response.failure(Messages.UnableToUpdateRestaurant);
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }

  async deleteRestaurant(id: number): Promise<ApiResponse> {
    try {
      const result = await this.restaurantRepo.delete(id);
      if (result && result.affected > 0) {
        return Response.success(Messages.RestaurantDeleted);
      } else {
        return Response.failure(Messages.RestaurantNotFound);
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }

  async getRestaurant(id: number): Promise<ApiResponse> {
    try {
      const result = await this.restaurantRepo.findOne({
        where: { id },
      });
      console.log(result);
      if (result) {
        return Response.success(result);
      } else {
        return Response.failure(Messages.RestaurantNotFound);
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }

  async getRestaurants(user: FilterRestaurantDto): Promise<ApiResponse> {
    try {
      const result = await this.restaurantRepo.find({
        where: { city: user.city },
      });
      if (!result || result.length <= 0)
        return Response.failure(Messages.NoRestaurant);

      const resataurants = [] as Array<Restaurant>;
      for (const restuarant of result) {
        //calculate distance between user's location and restaurant location in meters
        const distance = this.geoService.calculateDistanceInMeters(
          Number(user.latitude),
          Number(user.longitude),
          Number(restuarant.latitude),
          Number(restuarant.longitude),
        );
        if (distance <= user.distance) {
          resataurants.push(restuarant);
        }
      }

      if (resataurants && resataurants.length > 0)
        return Response.success(resataurants);

      return Response.failure(Messages.NoRestaurant);
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }
}
