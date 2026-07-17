import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.userRepo.findOneBy({ email: dto.email });
    if (existing) throw new ConflictException('Usuário já existe');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = this.userRepo.create({ email: dto.email, password: hashed });
    const saved = await this.userRepo.save(user);

    return { id: saved.id, email: saved.email };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas');

    const token = await this.jwtService.signAsync({ sub: user.id, email: user.email });
    return { token };
  }
}