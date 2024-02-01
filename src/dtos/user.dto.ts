import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
export class UserDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() @IsString() password: string;
}
export class AuthUserDto {
  @IsNotEmpty() @IsString() username: string;
  @IsNotEmpty() @IsString() sub: string;
}
export class UserAuthDto {
  @IsNotEmpty() @IsString() email: string;
  @IsNotEmpty() @IsString() password: string;
}
