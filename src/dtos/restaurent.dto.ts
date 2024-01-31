import { IsString, IsNotEmpty, IsLongitude, IsLatitude } from 'class-validator';

export class RestaurentDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsString() address: string;
  @IsNotEmpty() @IsLatitude() latitude: string;
  @IsNotEmpty() @IsLongitude() longitude: string;
}
