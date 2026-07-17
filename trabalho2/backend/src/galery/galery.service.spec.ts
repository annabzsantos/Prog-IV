import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { GaleryService } from './galery.service';
import { Galery } from './entities/galery.entity';

describe('GaleryService', () => {
  let service: GaleryService;

  const mockGaleryRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GaleryService,
        { provide: getRepositoryToken(Galery), useValue: mockGaleryRepo },
      ],
    }).compile();

    service = module.get<GaleryService>(GaleryService);
  });

  describe('create', () => {
    it('deve criar um item de galeria', async () => {
      const dto = {
        titulo: 'Ba Sing Se',
        conteudo: 'A capital do Reino da Terra',
        imagem: '/assets/cenario-ba-sing-se.png',
        categoria: 'cenario',
        ordem: 1,
      };
      mockGaleryRepo.create.mockReturnValue(dto);
      mockGaleryRepo.save.mockResolvedValue({ id: 1, ...dto });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...dto });
      expect(mockGaleryRepo.create).toHaveBeenCalledWith(dto);
      expect(mockGaleryRepo.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve listar todos os itens ordenados quando não há filtro', async () => {
      mockGaleryRepo.find.mockResolvedValue([]);

      await service.findAll();

      expect(mockGaleryRepo.find).toHaveBeenCalledWith({
        where: {},
        order: { ordem: 'ASC' },
      });
    });

    it('deve filtrar por categoria quando informado', async () => {
      mockGaleryRepo.find.mockResolvedValue([]);

      await service.findAll('batalha');

      expect(mockGaleryRepo.find).toHaveBeenCalledWith({
        where: { categoria: 'batalha' },
        order: { ordem: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um item existente', async () => {
      const item = { id: 1, titulo: 'Ba Sing Se' };
      mockGaleryRepo.findOneBy.mockResolvedValue(item);

      const result = await service.findOne(1);

      expect(result).toEqual(item);
    });

    it('deve lançar NotFoundException se o item não existir', async () => {
      mockGaleryRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um item existente', async () => {
      const existente = { id: 1, titulo: 'Antigo', categoria: 'cenario', ordem: 1 };
      mockGaleryRepo.findOneBy.mockResolvedValue(existente);
      mockGaleryRepo.save.mockImplementation((item) => Promise.resolve(item));

      const result = await service.update(1, { titulo: 'Novo título' });

      expect(result.titulo).toBe('Novo título');
    });

    it('deve lançar NotFoundException ao atualizar item inexistente', async () => {
      mockGaleryRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.update(999, { titulo: 'Não existe' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve remover um item existente', async () => {
      const item = { id: 1, titulo: 'Ba Sing Se' };
      mockGaleryRepo.findOneBy.mockResolvedValue(item);
      mockGaleryRepo.remove.mockResolvedValue(item);

      const result = await service.remove(1);

      expect(result).toEqual(item);
      expect(mockGaleryRepo.remove).toHaveBeenCalledWith(item);
    });

    it('deve lançar NotFoundException ao remover item inexistente', async () => {
      mockGaleryRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});