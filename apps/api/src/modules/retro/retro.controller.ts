import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { RetroService } from './retro.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

type RequestUser = {
  id: string;
  name: string;
};

@Controller('retro')
export class RetroController {
  constructor(private readonly retroService: RetroService) {}

  private getUser(req: any): RequestUser {
    return (
      req.user ?? {
        id: (req.headers?.['x-user-id'] as string) || 'default-user',
        name:
          (req.headers?.['x-user-name'] as string) ||
          process.env.DEFAULT_USER_NAME ||
          'Test User',
      }
    );
  }

  @Post('boards')
  createBoard(@Body() dto: CreateBoardDto, @Req() req: any) {
    return this.retroService.createBoard(dto, this.getUser(req));
  }

  @Get('boards')
  listBoards() {
    return this.retroService.listBoards();
  }

  @Get('boards/:id')
  getBoardById(@Param('id') id: string) {
    return this.retroService.getBoardById(id);
  }

  @Post('sections')
  createSection(@Body() dto: CreateSectionDto, @Req() req: any) {
    return this.retroService.createSection(dto, this.getUser(req));
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
  deleteSection(@Param('id') id: string) {
    return this.retroService.deleteSection(id);
  }

  @Post('items')
  createItem(@Body() dto: CreateItemDto, @Req() req: any) {
    const serverUser = this.getUser(req);
    const user = {
      id: dto.createdBy || serverUser.id,
      name: dto.createdByName || serverUser.name,
    };
    return this.retroService.createItem(dto, user);
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
  deleteItem(@Param('id') id: string) {
    return this.retroService.deleteItem(id);
  }
}