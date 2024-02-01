import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../../schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { UserAuthDto } from '../../dtos/user.dto';
import { Status } from 'src/enums';
import { Messages } from 'src/utils/messages/messages';
import { ApiResponse } from 'src/dtos/ApiResponse.dto';
import { Response } from 'src/helpers/responseHandler.helpers copy';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private encryptionService: CryptoService,
  ) {}

  async validateUser(authRequest: UserAuthDto): Promise<ApiResponse> {
    try {
      const res = await this.userService.findUserByEmail(authRequest.email);
      if (res.success) {
        const user = res.payload as User;

        if (user.status == Status.ACTIVE) {
          return Response.success(user);
        } else {
          return Response.failure('Account is InActive');
        }
      }
      return Response.failure(Messages.InvalidCredentials);
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }
  async login(authRequest: UserAuthDto): Promise<ApiResponse> {
    try {
      const res = await this.validateUser(authRequest);
      if (res.success) {
        const user = res.payload;
        const payload = { username: user.email, sub: user.uuid };

        const valid = await this.encryptionService.compare(
          user.password,
          authRequest.password,
        );
        if (!valid) return Response.failure(Messages.InvalidCredentials);

        delete user.password;
        const token = {
          access_token: this.jwtService.sign(payload),
          info: user,
        };
        return Response.success(token);
      } else {
        return Response.failure(res.message);
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Response.failure(Messages.Exception);
    }
  }
}
