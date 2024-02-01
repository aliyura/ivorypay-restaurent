import {
  IsString,
  IsNotEmpty,
  IsLongitude,
  IsLatitude,
  IsOptional,
} from 'class-validator';

export class RestaurantDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsString() address: string;
  @IsNotEmpty() @IsLatitude() latitude: string;
  @IsNotEmpty() @IsLongitude() longitude: string;
}

export class RestaurantUpdateDto {
  @IsOptional() @IsString() name: string;
  @IsOptional() @IsString() address: string;
  @IsOptional() @IsLatitude() latitude: string;
  @IsOptional() @IsLongitude() longitude: string;
}

export class FilterRestaurantDto {
  @IsOptional() @IsString() city: string;
  @IsOptional() @IsString() distance: number;
  @IsOptional() @IsLatitude() latitude: string;
  @IsOptional() @IsLongitude() longitude: string;
}
