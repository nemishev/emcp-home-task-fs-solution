import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { redisClientFactory } from './redis-client.factory';
import { RedisService } from './redis.service';
import { RedisHealthIndicator } from './redis.health';

@Module({
  imports: [TerminusModule],
  providers: [redisClientFactory, RedisService, RedisHealthIndicator],
  exports: [RedisService, RedisHealthIndicator],
})
export class RedisModule {}
