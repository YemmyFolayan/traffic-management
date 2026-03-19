import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TrafficModule } from './traffic/traffic.module';
import { SimulationModule } from './simulation/simulation.module';
import { DRLModule } from './drl/drl.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { GatewayModule } from './gateway/gateway.module';
import { SeedModule } from './database/seed.module';
import {
  User,
  Intersection,
  TrafficSignal,
  TrafficMetric,
  SimulationRun,
  DRLModel,
} from './database/entities';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST', 'localhost'),
        port: config.get<number>('DATABASE_PORT', 5432),
        username: config.get<string>('DATABASE_USERNAME', 'postgres'),
        password: config.get<string>('DATABASE_PASSWORD', 'postgres'),
        database: config.get<string>('DATABASE_NAME', 'itms'),
        entities: [User, Intersection, TrafficSignal, TrafficMetric, SimulationRun, DRLModel],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    TrafficModule,
    SimulationModule,
    DRLModule,
    AnalyticsModule,
    GatewayModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
