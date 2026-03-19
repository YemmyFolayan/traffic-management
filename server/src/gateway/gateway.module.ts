import { Module } from '@nestjs/common';
import { SimulationGateway } from './simulation.gateway';
import { SimulationModule } from '../simulation/simulation.module';

@Module({
  imports: [SimulationModule],
  providers: [SimulationGateway],
})
export class GatewayModule {}
