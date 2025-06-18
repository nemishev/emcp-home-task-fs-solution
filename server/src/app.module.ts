import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PingModule } from './ping/ping.module';
import { PongModule } from './pong/pong.module';

@Module({
  imports: [
    ConfigModule.forRoot({ ignoreEnvFile: true, isGlobal: true }),
    HealthModule,
    PingModule,
    PongModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
