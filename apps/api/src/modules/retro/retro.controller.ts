import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RetroService } from './retro.service';
import { CurrentUser, UserContext } from '../../common/current-user.decorator';
import {
  CreateBoardDto,
  CreateItemDto,
  CreateSectionDto,
  ReorderSectionsDto,
  UpdateItemDto,
  UpdateSectionDto,
} from './dto';

@Controller('retro')
export class RetroController {
  constructor(private readonly service: RetroService) {}

  // --------- Boards ---------

  @Post('boards')
  createBoard(
    @Body() dto: CreateBoardDto,
    @CurrentUser({ requireName: true }) user: UserContext,
  ) {
    return this.service.createBoard(dto, user);
  }

  @Get('boards')
  listBoards() {
    return this.service.listBoards();
  }

  @Get('boards/:id')
  getBoard(@Param('id') id: string) {
    return this.service.getBoard(id);
  }

  // --------- Sections ---------
  // NOTE: `sections/reorder` MUST be declared before `sections/:id`
  // routes that use a path parameter, otherwise Nest will treat
  // "reorder" as an :id value.

  @Patch('sections/reorder')
  reorderSections(@Body() dto: ReorderSectionsDto) {
    return this.service.reorderSections(dto);
  }

  @Post('sections')
  createSection(
    @Body() dto: CreateSectionDto,
    @CurrentUser({ requireName: true }) user: UserContext,
  ) {
    return this.service.createSection(dto, user);
  }

  @Patch('sections/:id')
  updateSection(@Param('id') id: string, @Body() dto: UpdateSectionDto) {
    return this.service.updateSection(id, dto);
  }

  @Delete('sections/:id')
  @HttpCode(200)
  deleteSection(@Param('id') id: string) {
    return this.service.deleteSection(id);
  }

  @Get('sections/:boardId')
  listSections(@Param('boardId') boardId: string) {
    return this.service.listSectionsForBoard(boardId);
  }

  // --------- Items ---------

  @Post('items')
  createItem(
    @Body() dto: CreateItemDto,
    @CurrentUser({ requireName: true }) user: UserContext,
  ) {
    return this.service.createItem(dto, user);
  }

  @Get('items/:boardId')
  listItems(@Param('boardId') boardId: string) {
    return this.service.listItemsForBoard(boardId);
  }

  @Patch('items/:id')
  updateItem(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
    @CurrentUser({ requireName: true }) user: UserContext,
  ) {
    return this.service.updateItem(id, dto, user);
  }

  @Delete('items/:id')
  @HttpCode(200)
  deleteItem(@Param('id') id: string) {
    return this.service.deleteItem(id);
  }
}
