import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  login(email: string) {
    const payload = {
      email,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}