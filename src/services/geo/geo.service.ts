import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiResponse } from 'src/dtos/ApiResponse.dto';
import { Helpers, Response } from 'src/helpers';

@Injectable()
export class GeoService {
  constructor(private readonly httpService: HttpService) {}

  async reverseCoordinates(lat, lon): Promise<ApiResponse> {
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${process.env.GEO_APIKEY}`;
    const response = await firstValueFrom(this.httpService.get(url));
    if (response.status == 200 && response.data) {
      return Response.success(response.data.results[0]);
    } else {
      return Response.failure(response.statusText);
    }
  }

  calculateDistanceInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // km
    const dLat = Helpers.toRad(lat2 - lat1);
    const dLon = Helpers.toRad(lon2 - lon1);
    lat1 = Helpers.toRad(lat1);
    lat2 = Helpers.toRad(lat2);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d * 1000;
  }
}
