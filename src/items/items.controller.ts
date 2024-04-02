import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateMoveDto } from './dto/create-move.dto';

@UseGuards(JwtAuthGuard)
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  findAll(@Query('includeDeleted') withDeleted?: string) {
    return this.itemsService.findAll(withDeleted);
  }

  @Post('restore')
  restoreItem(@Body("itemId") id: number) {
    return this.itemsService.restoreItem(id);
  }

  @Post('move')
  createMove(@Body() createMoveDto: CreateMoveDto) {
    return this.itemsService.createMove(createMoveDto);
  }

  @Get('moves')
  findAllItemsWithMoves() {
    return this.itemsService.findAllWithMoves();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}
