import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Galery } from './entities/galery.entity';
import { CreateGaleryDto } from './dto/create-galery.dto';
import { UpdateGaleryDto } from './dto/update-galery.dto';

@Injectable()
export class GaleryService {
  constructor(
    @InjectRepository(Galery) private readonly repo: Repository<Galery>,
  ) {}

  create(dto: CreateGaleryDto) {
    const item = this.repo.create(dto);
    return this.repo.save(item);
  }

  findAll(categoria?: string) {
    return this.repo.find({
      where: categoria ? { categoria } : {},
      order: { ordem: 'ASC' },
    });
  }

  async findOne(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Item não encontrado');
    return item;
  }

  async update(id: number, dto: UpdateGaleryDto) {
    const item = await this.findOne(id);
    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    return this.repo.remove(item);
  }
}