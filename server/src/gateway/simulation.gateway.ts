import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SimulationEngine } from '../simulation/simulation.engine';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class SimulationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private simulationIntervals = new Map<string, NodeJS.Timeout>();

  constructor(private readonly engine: SimulationEngine) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.stopClientSimulation(client.id);
  }

  @SubscribeMessage('start_simulation')
  async handleStartSimulation(@ConnectedSocket() client: Socket, @MessageBody() config: any) {
    this.stopClientSimulation(client.id);

    const simConfig = {
      vehicleCount: config.vehicleCount || 50,
      simulationSpeed: config.simulationSpeed || 1,
      gridSize: config.gridSize || 500,
      intersectionCount: config.intersectionCount || 4,
      useRL: config.useRL || false,
    };

    this.engine.initialize(simConfig);
    this.engine.start();

    const interval = setInterval(() => {
      if (!this.engine.isRunning()) {
        this.stopClientSimulation(client.id);
        return;
      }
      const state = this.engine.step();
      client.emit('simulation_update', state);
    }, 100);

    this.simulationIntervals.set(client.id, interval);

    client.emit('simulation_started', { config: simConfig });
  }

  @SubscribeMessage('stop_simulation')
  handleStopSimulation(@ConnectedSocket() client: Socket) {
    this.engine.stop();
    this.stopClientSimulation(client.id);
    const state = this.engine.getState();
    client.emit('simulation_complete', state);
  }

  @SubscribeMessage('reset_simulation')
  handleResetSimulation(@ConnectedSocket() client: Socket) {
    this.engine.reset();
    this.stopClientSimulation(client.id);
    client.emit('simulation_reset', { message: 'Simulation reset' });
  }

  private stopClientSimulation(clientId: string) {
    const interval = this.simulationIntervals.get(clientId);
    if (interval) {
      clearInterval(interval);
      this.simulationIntervals.delete(clientId);
    }
  }
}
