import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configService: ConfigService) => {
        const client = createClient({
          socket: {
            host: configService.get('redis_host'),
            port: parseInt(configService.get('redis_port')),
          },
          database: parseInt(configService.get('redis_db')),
          password: configService.get('redis_password'),
        });
        client.on('error', (err) => {
          console.error('Redis 客户端错误:', err);
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
