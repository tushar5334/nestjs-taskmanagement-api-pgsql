import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IsUserAlreadyExistConstraint } from '../custome-validators/is-user-already-exist';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: 3600 }
        };
      }
    })
    /* JwtModule.register(
      {
        secret: 'JwtSecret@123',
        //signOptions: { expiresIn: 3600 }
      }
    ), */
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, JwtStrategy, IsUserAlreadyExistConstraint],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
