import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { AuthUserDto, UserDto } from '../../dtos/user.dto';
import { ApiResponse } from '../../dtos/ApiResponse.dto';
import { Helpers } from 'src/helpers';
import { Status, UserRole } from 'src/enums';
import * as NodeCache from 'node-cache';
import { Messages } from 'src/utils/messages/messages';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CryptoService } from '../crypto/crypto.service';

@Injectable()
export class UserService {
  cache = new NodeCache();
  constructor(
    @InjectRepository(User) private user: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly encryptionService: CryptoService,
  ) {}

  async createUser(requestDto: UserDto): Promise<ApiResponse> {
    try {
      const userExist = await this.user.findOne({
        where: { email: requestDto.email },
      });
      if (userExist) return Helpers.failure('User already exist');

      //encrypt password
      const hash = await this.encryptionService.encrypt(requestDto.password);
      const uniqueId = await Helpers.getUniqueId();
      requestDto.password = hash;

      const request = {
        ...requestDto,
        status: Status.ACTIVE,
        role: UserRole.ADMIN,
        uuid: uniqueId,
      } as User;

      const created = await this.user.save(request);
      if (created) {
        return Helpers.success(created);
      } else {
        return Helpers.failure('Unable to create your account');
      }
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Helpers.failure(Messages.Exception);
    }
  }

  async findUserByEmail(email: string): Promise<ApiResponse> {
    try {
      const result = await this.user.findOne({ where: { email: email } });
      if (result) {
        return Helpers.success(result);
      }
      return Helpers.failure(Messages.UserNotFound);
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Helpers.failure(Messages.Exception);
    }
  }

  async findUserByToken(authToken: string): Promise<ApiResponse> {
    try {
      const user = (await this.jwtService.decode(authToken)) as AuthUserDto;
      const response = await this.findUserByEmail(user.username);
      if (response.success) {
        return Helpers.success(user);
      }
      return Helpers.failure(Messages.UserNotFound);
    } catch (ex) {
      console.log(Messages.Exception, ex);
      return Helpers.failure(Messages.Exception);
    }
  }
}
