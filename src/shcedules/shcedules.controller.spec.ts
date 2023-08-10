import { Test, TestingModule } from '@nestjs/testing';
import { ShcedulesController } from './shcedules.controller';
import { ShcedulesService } from './shcedules.service';

describe('ShcedulesController', () => {
  let controller: ShcedulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShcedulesController],
      providers: [ShcedulesService],
    }).compile();

    controller = module.get<ShcedulesController>(ShcedulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
