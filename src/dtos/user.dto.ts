import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsEnum,
  IsEmail,
} from 'class-validator';
import { UserRole } from 'src/enums';

export class UserDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsOptional() @IsString() password: string;
  @IsOptional() @IsEnum(UserRole) role: string;
}
export class AuthUserDto {
  @IsNotEmpty() @IsString() username: string;
  @IsNotEmpty() @IsString() sub: string;
}
export class UserAuthDto {
  @IsNotEmpty() @IsString() email: string;
  @IsNotEmpty() @IsString() password: string;
}
