import { Controller, Get } from '@nestjs/common';
import { Public } from '../common/decorators/public.decorator';

@Controller('health')
export class HealthController {
  @Get()
  @Public()
  checkHealth() {
    return { status: 'ok', ts: new Date().toISOString() };
  }
}
