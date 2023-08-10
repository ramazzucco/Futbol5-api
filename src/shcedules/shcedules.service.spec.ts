import { Test, TestingModule } from '@nestjs/testing';
import { ShcedulesService } from './shcedules.service';

describe('ShcedulesService', () => {
  let service: ShcedulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShcedulesService],
    }).compile();

    service = module.get<ShcedulesService>(ShcedulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
