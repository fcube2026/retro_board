import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RetroService } from './retro.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('retro')
export class RetroController {
  constructor(private readonly retroService: RetroService) {}

  // Boards
  @Post('boards')
  @HttpCode(HttpStatus.CREATED)
  createBoard(@Body() dto: CreateBoardDto) {
    return this.retroService.createBoard(dto);
  }

  @Get('boards')
  listBoards() {
    return this.retroService.listBoards();
  }

  @Get('boards/:id')
  getBoardById(@Param('id') id: string) {
    return this.retroService.getBoardById(id);
  }

  // Sections — reorder MUST come before /:id
  @Post('sections')
  @HttpCode(HttpStatus.CREATED)
  createSection(@Body() dto: CreateSectionDto) {
    return this.retroService.createSection(dto);
  }

  @Patch('sections/reorder')
  reorderSections(@Body() dto: ReorderSectionsDto) {
    return this.retroService.reorderSections(dto);
  }

  @Get('sections/:boardId')
  listSections(@Param('boardId') boardId: string) {
    return this.retroService.listSections(boardId);
  }

  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.retroService.updateSection(id, dto);
  }

  @Delete('sections/:id')
  @HttpCode(HttpStatus.OK)
  deleteSection(@Param('id') id: string) {
    return this.retroService.deleteSection(id);
  }

  // Items
  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  createItem(@Body() dto: CreateItemDto) {
    return this.retroService.createItem(dto);
  }

  @Get('items/:boardId')
  listItems(@Param('boardId') boardId: string) {
    return this.retroService.listItems(boardId);
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.retroService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.OK)
  deleteItem(@Param('id') id: string) {
    return this.retroService.deleteItem(id);
  }
}
