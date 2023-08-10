import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ShcedulesService } from './shcedules.service';
import { CreateShceduleDto } from './dto/create-shcedule.dto';
import { UpdateShceduleDto } from './dto/update-shcedule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/_shared/guards/auth/auth.guard';

@ApiBearerAuth()
@Controller('shcedules')
@ApiTags('shcedules')
export class ShcedulesController {
  constructor(private readonly shcedulesService: ShcedulesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createShceduleDto: CreateShceduleDto) {
    return this.shcedulesService.create(createShceduleDto);
  }

  @Get()
  findAll() {
    return this.shcedulesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shcedulesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateShceduleDto: UpdateShceduleDto) {
    return this.shcedulesService.update(id, updateShceduleDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.shcedulesService.remove(id);
  }
}
