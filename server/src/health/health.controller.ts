import { Controller, Get } from '@nestjs/common';
import { RedisHealthIndicator } from '../redis/redis.health';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private redisHealthIndicator: RedisHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([() => this.redisHealthIndicator.isHealthy()]);
  }
}
