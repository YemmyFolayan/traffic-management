import { Controller, Get } from '@nestjs/common';
import { successResponse } from './common/interfaces/api-response.interface';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return successResponse({ status: 'ok', timestamp: new Date().toISOString() });
  }
}
