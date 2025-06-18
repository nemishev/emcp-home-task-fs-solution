import { Injectable } from '@nestjs/common';
import {
  HealthIndicatorService,
  HealthIndicatorResult,
} from '@nestjs/terminus';

import { RedisService } from './redis.service';

/**
 * Redis health indicator
 */
@Injectable()
export class RedisHealthIndicator {
  constructor(
    private readonly healthIndicatorService: HealthIndicatorService,
    private readonly redis: RedisService,
  ) {}

  /**
   * Check if the Redis is healthy
   *
   * @returns {HealthIndicatorResult} Health indicator for Redis
   */
  isHealthy(): HealthIndicatorResult {
    const indicator = this.healthIndicatorService.check('redis');

    return this.redis.isReady
      ? indicator.up()
      : indicator.down({
          message: 'Redis is unhealthy.',
        });
  }
}
