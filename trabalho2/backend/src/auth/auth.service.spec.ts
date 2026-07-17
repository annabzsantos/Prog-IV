import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepo = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('deve criar um usuário novo com senha hasheada', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);
      mockUserRepo.create.mockImplementation((dto) => dto);
      mockUserRepo.save.mockImplementation((user) =>
        Promise.resolve({ id: 1, ...user }),
      );

      const result = await service.register({
        email: 'a@a.com',
        password: '123456',
      });

      expect(result).toEqual({ id: 1, email: 'a@a.com' });
      expect(mockUserRepo.save).toHaveBeenCalled();

      // garante que a senha salva não é a senha em texto puro
      const savedArg = mockUserRepo.save.mock.calls[0][0];
      expect(savedArg.password).not.toBe('123456');
      const senhaValida = await bcrypt.compare('123456', savedArg.password);
      expect(senhaValida).toBe(true);
    });

    it('deve lançar ConflictException se o email já existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue({ id: 1, email: 'a@a.com' });

      await expect(
        service.register({ email: 'a@a.com', password: '123456' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('deve retornar um token para credenciais válidas', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      mockUserRepo.findOneBy.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        password: senhaHash,
      });
      mockJwtService.signAsync.mockResolvedValue('token-falso-123');

      const result = await service.login({
        email: 'a@a.com',
        password: '123456',
      });

      expect(result).toEqual({ token: 'token-falso-123' });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: 1,
        email: 'a@a.com',
      });
    });

    it('deve lançar UnauthorizedException se o usuário não existir', async () => {
      mockUserRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nao@existe.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se a senha estiver errada', async () => {
      const senhaHash = await bcrypt.hash('123456', 10);
      mockUserRepo.findOneBy.mockResolvedValue({
        id: 1,
        email: 'a@a.com',
        password: senhaHash,
      });

      await expect(
        service.login({ email: 'a@a.com', password: 'senha-errada' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});