import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '654321' })
  @IsString()
  @MinLength(6)
  password: string;
}