import { Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { Inject } from '@nestjs/common';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private readonly redisClient: RedisClientType;

  async set(key: string, value: string, expire: number) {
    await this.redisClient.set(key, value);
    if (expire) {
      await this.redisClient.expire(key, expire);
    }
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }
}
