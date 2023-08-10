import { PartialType } from '@nestjs/swagger';
import { CreateShceduleDto } from './create-shcedule.dto';

export class UpdateShceduleDto extends PartialType(CreateShceduleDto) {}
