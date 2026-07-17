import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('deve chamar o service ao registrar', async () => {
    const dto = { email: 'a@a.com', password: '123456' };
    mockAuthService.register.mockResolvedValue({ id: 1, email: 'a@a.com' });

    const result = await controller.register(dto);

    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, email: 'a@a.com' });
  });

  it('deve chamar o service ao logar', async () => {
    const dto = { email: 'a@a.com', password: '123456' };
    mockAuthService.login.mockResolvedValue({ token: 'token-falso' });

    const result = await controller.login(dto);

    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ token: 'token-falso' });
  });
});