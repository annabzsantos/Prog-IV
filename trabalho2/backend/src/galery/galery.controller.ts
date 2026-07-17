import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { GaleryService } from './galery.service';
import { CreateGaleryDto } from './dto/create-galery.dto';
import { UpdateGaleryDto } from './dto/update-galery.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('galery')
export class GaleryController {
  constructor(private readonly galeryService: GaleryService) {}

  @Post()
  create(@Body() dto: CreateGaleryDto) {
    return this.galeryService.create(dto);
  }

  @Get()
  findAll(@Query('categoria') categoria?: string) {
    return this.galeryService.findAll(categoria);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.galeryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateGaleryDto) {
    return this.galeryService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.galeryService.remove(+id);
  }
}