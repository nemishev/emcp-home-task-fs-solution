import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { RedisClient, REDIS_CLIENT } from './redis-client.type';

/**
 * Redis client wrapper service
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  public constructor(
    @Inject(REDIS_CLIENT) private readonly redis: RedisClient,
  ) {}

  /**
   * Verifies if the Redis client is connected and ready to send commands,
   *
   * @returns {Boolean} Ready status
   */
  isReady(): boolean {
    return this.redis.isReady;
  }

  /**
   * Close redis connection on shutdown
   */
  onModuleDestroy() {
    this.redis.quit();
  }
}
