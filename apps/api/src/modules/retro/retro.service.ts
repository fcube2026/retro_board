import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

const DEFAULT_SECTIONS = [
  { title: '✅ What went well', order: 0, type: 'DEFAULT' as const },
  { title: "❌ What didn't go well", order: 1, type: 'DEFAULT' as const },
  { title: '🔧 Action Items', order: 2, type: 'DEFAULT' as const },
];

type CurrentUser = {
  id: string;
  name: string;
};

@Injectable()
export class RetroService {
  constructor(private readonly prisma: PrismaService) {}

  async createBoard(dto: CreateBoardDto, user: CurrentUser) {
    const board = await this.prisma.retroBoard.create({
      data: {
        title: dto.title,
        createdBy: dto.createdBy || user.id,
      },
    });

    await Promise.all(
      DEFAULT_SECTIONS.map((section) =>
        this.prisma.retroSection.create({
          data: {
            boardId: board.id,
            title: section.title,
            order: section.order,
            type: section.type,
            createdBy: user.id,
          },
        }),
      ),
    );

    return this.getBoardById(board.id);
  }

  async listBoards() {
    return this.prisma.retroBoard.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { items: true } },
        sections: {
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getBoardById(id: string) {
    const board = await this.prisma.retroBoard.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            items: {
              orderBy: { createdAt: 'asc' },
            },
          },
        },
        items: {
          orderBy: { createdAt: 'asc' },
          include: { section: true },
        },
      },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${id} not found`);
    }

    return board;
  }

  async createSection(dto: CreateSectionDto, user: CurrentUser) {
    const board = await this.prisma.retroBoard.findUnique({
      where: { id: dto.boardId },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${dto.boardId} not found`);
    }

    const maxOrder = await this.prisma.retroSection.aggregate({
      where: { boardId: dto.boardId },
      _max: { order: true },
    });

    const order =
      dto.order ?? (maxOrder._max.order !== null ? maxOrder._max.order + 1 : 0);

    return this.prisma.retroSection.create({
      data: {
        boardId: dto.boardId,
        title: dto.title,
        order,
        type: 'CUSTOM',
        createdBy: user.id,
      },
    });
  }

  async updateSection(id: string, dto: UpdateSectionDto) {
    const section = await this.prisma.retroSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with id ${id} not found`);
    }

    return this.prisma.retroSection.update({
      where: { id },
      data: dto,
    });
  }

  async deleteSection(id: string) {
    const section = await this.prisma.retroSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with id ${id} not found`);
    }

    await this.prisma.retroSection.delete({ where: { id } });

    return { message: 'Section deleted successfully' };
  }

  async reorderSections(dto: ReorderSectionsDto) {
    const updates = dto.sectionIds.map((sectionId, index) =>
      this.prisma.retroSection.update({
        where: { id: sectionId },
        data: { order: index },
      }),
    );

    await this.prisma.$transaction(updates);

    return { message: 'Sections reordered successfully' };
  }

  async listSections(boardId: string) {
    const board = await this.prisma.retroBoard.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${boardId} not found`);
    }

    return this.prisma.retroSection.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  async createItem(dto: CreateItemDto, user: CurrentUser) {
    const section = await this.prisma.retroSection.findUnique({
      where: { id: dto.sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Section with id ${dto.sectionId} not found`);
    }

    return this.prisma.retroItem.create({
      data: {
        boardId: dto.boardId,
        sectionId: dto.sectionId,
        content: dto.content,
        createdBy: user.id,
        createdByName: user.name,
      },
      include: { section: true },
    });
  }

  async listItems(boardId: string) {
    const board = await this.prisma.retroBoard.findUnique({
      where: { id: boardId },
    });

    if (!board) {
      throw new NotFoundException(`Board with id ${boardId} not found`);
    }

    return this.prisma.retroItem.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
      include: { section: true },
    });
  }

  async updateItem(id: string, dto: UpdateItemDto) {
    const item = await this.prisma.retroItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    return this.prisma.retroItem.update({
      where: { id },
      data: dto,
      include: { section: true },
    });
  }

  async deleteItem(id: string) {
    const item = await this.prisma.retroItem.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`Item with id ${id} not found`);
    }

    await this.prisma.retroItem.delete({ where: { id } });

    return { message: 'Item deleted successfully' };
  }
}