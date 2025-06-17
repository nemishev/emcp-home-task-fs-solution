import { FactoryProvider } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisClient, REDIS_CLIENT } from './redis-client.type';
import { ConfigService } from '@nestjs/config';

/**
 * RedisSeervice provider factory
 */
export const redisClientFactory: FactoryProvider<Promise<RedisClient>> = {
  provide: REDIS_CLIENT,
  useFactory: async (config: ConfigService) => {
    const client = createClient({
      url: `redis://${config.get('REDIS_HOST')}:${config.get('REDIS_PORT')}`,
    });
    await client.connect();

    return client;
  },
  inject: [ConfigService],
};
