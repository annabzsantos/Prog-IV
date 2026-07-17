import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Galery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  conteudo: string;

  @Column()
  imagem: string;

  @Column()
  categoria: string; // 'cenario' | 'batalha' | 'arte'

  @Column({ default: 0 })
  ordem: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}