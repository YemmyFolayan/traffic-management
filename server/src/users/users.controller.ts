import { Controller, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { successResponse } from '../common/interfaces/api-response.interface';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll() {
    const users = await this.usersService.findAll();
    return successResponse(users);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return successResponse(user);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() data: any) {
    const user = await this.usersService.update(id, data);
    return successResponse(user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return successResponse({ message: 'User deleted' });
  }
}
