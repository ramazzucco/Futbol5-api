import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DaysService } from './days.service';
import { CreateDayDto } from './dto/create-day.dto';
import { UpdateDayDto } from './dto/update-day.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/_shared/guards/auth/auth.guard';

@ApiBearerAuth()
@Controller('days')
@ApiTags('days')
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createDayDto: CreateDayDto) {
    return this.daysService.create(createDayDto);
  }

  @Get()
  findAll() {
    return this.daysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.daysService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateDayDto: UpdateDayDto) {
    return this.daysService.update(id, updateDayDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.daysService.remove(id);
  }
}
