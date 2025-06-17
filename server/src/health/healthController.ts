import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  checkHealth(): string {
    // You can add more logic here if needed.
    //TODO ping the redis
    return 'OK';
  }
}
