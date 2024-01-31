import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserAuthDto } from '../../dtos/user.dto';
import { Helpers } from '../../helpers/utitlity.helpers';
import { Status } from 'src/enums';
import { Messages } from 'src/utils/messages/messages';
import { ApiResponse } from 'src/dtos/ApiResponse.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(authRequest: UserAuthDto): Promise<ApiResponse> {
    try {
      const res = await this.userService.findUserByEmail(authRequest.email);
      if (res.success) {
        const user = res.payload as User;

        if (user.status == Status.ACTIVE) {
          return Helpers.success(user);
        } else {
          return Helpers.failure('Account is InActive');
        }
      }
      return Helpers.failure(Messages.InvalidCredentials);
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Helpers.failure(Messages.Exception);
    }
  }
  async login(authRequest: UserAuthDto): Promise<ApiResponse> {
    try {
      const res = await this.validateUser(authRequest);
      if (res.success) {
        const user = res.payload as User;
        const payload = { username: user.email, sub: user.uuid };
        delete user.password;

        const token = {
          access_token: this.jwtService.sign(payload),
          info: user,
        };
        const result = Helpers.success(token);
        return result;
      } else {
        return Helpers.failure(res.message);
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Helpers.failure(Messages.Exception);
    }
  }
}
