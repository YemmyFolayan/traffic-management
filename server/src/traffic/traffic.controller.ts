import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { CreateIntersectionDto } from './dto/create-intersection.dto';
import { UpdateIntersectionDto } from './dto/update-intersection.dto';
import { UpdateSignalDto } from './dto/update-signal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../common/enums';
import { successResponse } from '../common/interfaces/api-response.interface';

@Controller('intersections')
@UseGuards(JwtAuthGuard)
export class TrafficController {
  constructor(private readonly trafficService: TrafficService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async create(@Body() dto: CreateIntersectionDto, @CurrentUser() user: any) {
    const intersection = await this.trafficService.createIntersection(dto, user.id);
    return successResponse(intersection);
  }

  @Get()
  async findAll() {
    const intersections = await this.trafficService.findAllIntersections();
    return successResponse(intersections);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const intersection = await this.trafficService.findOneIntersection(id);
    return successResponse(intersection);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async update(@Param('id') id: string, @Body() dto: UpdateIntersectionDto) {
    const intersection = await this.trafficService.updateIntersection(id, dto);
    return successResponse(intersection);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.trafficService.deleteIntersection(id);
    return successResponse({ message: 'Intersection deleted' });
  }

  @Get(':id/signals')
  async getSignals(@Param('id') id: string) {
    const signals = await this.trafficService.getSignals(id);
    return successResponse(signals);
  }

  @Put('signals/:signalId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OPERATOR)
  async updateSignal(@Param('signalId') signalId: string, @Body() dto: UpdateSignalDto) {
    const signal = await this.trafficService.updateSignal(signalId, dto);
    return successResponse(signal);
  }
}
