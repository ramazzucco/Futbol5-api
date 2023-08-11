import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { FieldsService } from './fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { UpdateFieldDto } from './dto/update-field.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/_shared/guards/auth/auth.guard';

@ApiBearerAuth()
@Controller('fields')
@ApiTags('fields')
export class FieldsController {
  constructor(private readonly fieldsService: FieldsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createFieldDto: CreateFieldDto) {
    return this.fieldsService.create(createFieldDto);
  }

  @Get()
  findAll() {
    return this.fieldsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fieldsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    return this.fieldsService.update(+id, updateFieldDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.fieldsService.remove(+id);
  }
}
