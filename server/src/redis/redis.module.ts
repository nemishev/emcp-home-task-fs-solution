import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { RedisService } from './redis.service';
import { RedisHealthIndicator } from './redis.health';

@Module({
  imports: [TerminusModule],
  providers: [RedisService, RedisHealthIndicator],
  exports: [RedisService, RedisHealthIndicator],
})
export class RedisModule {}
