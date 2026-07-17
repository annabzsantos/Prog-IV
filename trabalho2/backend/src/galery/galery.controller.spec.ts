import { Test, TestingModule } from '@nestjs/testing';
import { GaleryController } from './galery.controller';
import { GaleryService } from './galery.service';

describe('GaleryController', () => {
  let controller: GaleryController;

  const mockGaleryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GaleryController],
      providers: [{ provide: GaleryService, useValue: mockGaleryService }],
    }).compile();

    controller = module.get<GaleryController>(GaleryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o service ao criar', async () => {
    const dto = { titulo: 'A', conteudo: 'B', imagem: 'c.png', categoria: 'arte' };
    mockGaleryService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto as any);

    expect(mockGaleryService.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('deve chamar o service ao listar', async () => {
    mockGaleryService.findAll.mockResolvedValue([]);

    const result = await controller.findAll();

    expect(mockGaleryService.findAll).toHaveBeenCalledWith(undefined);
    expect(result).toEqual([]);
  });
});