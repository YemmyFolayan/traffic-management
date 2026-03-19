import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { successResponse } from '../common/interfaces/api-response.interface';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  async getOverview() {
    const overview = await this.analyticsService.getOverview();
    return successResponse(overview);
  }

  @Get('comparison')
  async getComparison() {
    const comparison = await this.analyticsService.getComparison();
    return successResponse(comparison);
  }

  @Get('traffic-metrics')
  async getTrafficMetrics(
    @Query('intersectionId') intersectionId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const metrics = await this.analyticsService.getTrafficMetrics({ intersectionId, from, to });
    return successResponse(metrics);
  }
}
