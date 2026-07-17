import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGaleryDto {
  @ApiProperty({ example: 'Ba Sing Se' })
  @IsString() @IsNotEmpty()
  titulo: string;

  @ApiProperty({ example: 'Descrição da imagem' })
  @IsString() @IsNotEmpty()
  conteudo: string;

  @ApiProperty({ example: 'URL da imagem' })
  @IsString() @IsNotEmpty()
  imagem: string;

  @ApiProperty({ example: 'Cenário' })
  @IsString() @IsNotEmpty()
  categoria: string;

  @ApiProperty({ example: 1 })
  @IsInt() @IsOptional()
  ordem?: number;
}