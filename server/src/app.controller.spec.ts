import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should return ok status and timestamp', () => {
      const res = appController.health();
      expect(res.status).toBe(true);
      expect(res.entity).toMatchObject({ status: 'ok' });
      expect(typeof (res.entity as { timestamp: string }).timestamp).toBe('string');
    });
  });
});
