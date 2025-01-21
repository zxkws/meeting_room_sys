import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Permission } from './user/entities/permission.entity';
import { Role } from './user/entities/role.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginGuard } from './login.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './permission.guard';
import * as path from 'path';
@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('jwt_secret'),
        signOptions: { expiresIn: configService.get('jwt_access_token_expires_time') },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql_host'),
        port: parseInt(configService.get('mysql_port')),
        username: configService.get('mysql_username'),
        password: configService.get('mysql_password'),
        database: configService.get('mysql_database'),
        entities: [User, Permission, Role],
        synchronize: true,
        logging: true,
        poolSize: 10,
        connectorPackage: 'mysql2',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, '.env'),
    }),
    RedisModule,
    EmailModule,
  ],
  controllers: [],
  providers: [
    { provide: APP_GUARD, useClass: LoginGuard },
    { provide: APP_GUARD, useClass: PermissionGuard },
  ],
})
export class AppModule {}
