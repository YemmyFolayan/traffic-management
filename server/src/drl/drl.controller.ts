import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { DRLService } from './drl.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { successResponse } from '../common/interfaces/api-response.interface';

@Controller('drl')
@UseGuards(JwtAuthGuard)
export class DRLController {
  constructor(private readonly drlService: DRLService) {}

  @Post('training')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async startTraining(@Body() config: Record<string, unknown>) {
    const model = await this.drlService.startTraining(config);
    return successResponse(model);
  }

  @Get('models')
  async getModels() {
    const models = await this.drlService.getModels();
    return successResponse(models);
  }

  @Get('models/:id')
  async getModel(@Param('id') id: string) {
    const model = await this.drlService.getModel(id);
    return successResponse(model);
  }

  @Get('progress')
  getProgress() {
    const progress = this.drlService.getTrainingProgress();
    return successResponse(progress);
  }

  @Post('stop')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async stopTraining() {
    this.drlService.stopTraining();
    return successResponse({ message: 'Training stopped' });
  }
}
