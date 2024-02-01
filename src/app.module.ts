import { Module } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { UserService } from './services/user/user.service';
import { AuthService } from './services/auth/auth.service';
import { UserController } from './api/v1/user/user.controller';
import { AuthController } from './api/v1/auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthStrategy } from './services/auth/auth.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoService } from './services/crypto/crypto.service';
import { Restaurant } from './schemas/restaurant.schema';
import { RestaurantController } from './api/v1/restaurent/restaurant.controller';
import { RestaurantService } from './services/restaurent/restaurant.service';
import { GeoService } from './services/geo/geo.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.schema{.ts,.js}'],
      synchronize: true,
      // logging: true,
    }),
    TypeOrmModule.forFeature([User, Restaurant]),
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: '10000s' },
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.APP_SECRET,
      signOptions: { expiresIn: '10000s' },
    }),
    PassportModule,
    HttpModule,
  ],
  controllers: [UserController, AuthController, RestaurantController],
  providers: [
    UserService,
    AuthService,
    RestaurantService,
    CryptoService,
    GeoService,
    AuthStrategy,
  ],
})
export class AppModule {}
