import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { RetroBoard, RetroSection, RetroItem } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UserContext } from '../../common/current-user.decorator';
import { RetroGateway } from './gateway/retro.gateway';
import {
  CreateBoardDto,
  CreateItemDto,
  CreateSectionDto,
  ReorderSectionsDto,
  UpdateItemDto,
  UpdateSectionDto,
} from './dto';

const DEFAULT_SECTIONS: Array<{ title: string; type: string; color: string; order: number }> = [
  { title: '✅ What went well', type: 'went_well', color: '#16a34a', order: 0 },
  { title: "❌ What didn't go well", type: 'went_wrong', color: '#dc2626', order: 1 },
  { title: '🔧 Action items / Improvements', type: 'action_items', color: '#2563eb', order: 2 },
];

@Injectable()
export class RetroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gateway: RetroGateway,
  ) {}

  // ---------------------- Boards ----------------------

  async createBoard(dto: CreateBoardDto, user: UserContext): Promise<RetroBoard> {
    const board = await this.prisma.retroBoard.create({
      data: {
        title: dto.title.trim(),
        createdBy: user.userId,
        sections: {
          create: DEFAULT_SECTIONS.map((s) => ({
            title: s.title,
            type: s.type,
            color: s.color,
            order: s.order,
            createdBy: user.userId,
          })),
        },
      },
    });
    this.gateway.emit({ type: 'board.created', boardId: board.id, payload: board });
    return board;
  }

  async listBoards(): Promise<Array<RetroBoard & { _count: { items: number; sections: number } }>> {
    return this.prisma.retroBoard.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { items: true, sections: true } } },
    });
  }

  async getBoard(id: string): Promise<RetroBoard & { sections: RetroSection[]; items: RetroItem[] }> {
    const board = await this.prisma.retroBoard.findUnique({
      where: { id },
      include: {
        sections: { orderBy: { order: 'asc' } },
        items: { orderBy: { createdAt: 'asc' } },
      },
    });
    if (!board) throw new NotFoundException(`Board ${id} not found`);
    return board;
  }

  // ---------------------- Sections ----------------------

  async createSection(dto: CreateSectionDto, user: UserContext): Promise<RetroSection> {
    await this.assertBoardExists(dto.boardId);

    const order =
      dto.order ??
      ((await this.prisma.retroSection.aggregate({
        where: { boardId: dto.boardId },
        _max: { order: true },
      }))._max.order ?? -1) + 1;

    const section = await this.prisma.retroSection.create({
      data: {
        boardId: dto.boardId,
        title: dto.title.trim(),
        type: dto.type ?? null,
        color: dto.color ?? null,
        order,
        createdBy: user.userId,
      },
    });
    this.gateway.emit({ type: 'section.created', boardId: section.boardId, payload: section });
    return section;
  }

  async updateSection(id: string, dto: UpdateSectionDto): Promise<RetroSection> {
    const existing = await this.prisma.retroSection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Section ${id} not found`);

    const section = await this.prisma.retroSection.update({
      where: { id },
      data: {
        ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
        ...(dto.color !== undefined ? { color: dto.color } : {}),
        ...(dto.order !== undefined ? { order: dto.order } : {}),
      },
    });
    this.gateway.emit({ type: 'section.updated', boardId: section.boardId, payload: section });
    return section;
  }

  async deleteSection(id: string): Promise<{ id: string; boardId: string }> {
    const existing = await this.prisma.retroSection.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Section ${id} not found`);
    await this.prisma.retroSection.delete({ where: { id } });
    this.gateway.emit({
      type: 'section.deleted',
      boardId: existing.boardId,
      payload: { id, boardId: existing.boardId },
    });
    return { id, boardId: existing.boardId };
  }

  async reorderSections(dto: ReorderSectionsDto): Promise<RetroSection[]> {
    if (dto.sections.length === 0) throw new BadRequestException('No sections supplied');

    // Make sure all section IDs belong to the board
    const existing = await this.prisma.retroSection.findMany({
      where: { boardId: dto.boardId, id: { in: dto.sections.map((s) => s.id) } },
      select: { id: true },
    });
    const validIds = new Set(existing.map((e) => e.id));
    const invalid = dto.sections.filter((s) => !validIds.has(s.id));
    if (invalid.length > 0) {
      throw new BadRequestException(
        `Section(s) not in board ${dto.boardId}: ${invalid.map((i) => i.id).join(', ')}`,
      );
    }

    await this.prisma.$transaction(
      dto.sections.map((s) =>
        this.prisma.retroSection.update({ where: { id: s.id }, data: { order: s.order } }),
      ),
    );

    const sections = await this.prisma.retroSection.findMany({
      where: { boardId: dto.boardId },
      orderBy: { order: 'asc' },
    });
    this.gateway.emit({ type: 'sections.reordered', boardId: dto.boardId, payload: sections });
    return sections;
  }

  async listSectionsForBoard(boardId: string): Promise<RetroSection[]> {
    await this.assertBoardExists(boardId);
    return this.prisma.retroSection.findMany({
      where: { boardId },
      orderBy: { order: 'asc' },
    });
  }

  // ---------------------- Items ----------------------

  async createItem(dto: CreateItemDto, user: UserContext): Promise<RetroItem> {
    const section = await this.prisma.retroSection.findUnique({ where: { id: dto.sectionId } });
    if (!section) throw new NotFoundException(`Section ${dto.sectionId} not found`);
    if (section.boardId !== dto.boardId) {
      throw new BadRequestException('Section does not belong to the supplied board');
    }

    const item = await this.prisma.retroItem.create({
      data: {
        boardId: dto.boardId,
        sectionId: dto.sectionId,
        content: dto.content.trim(),
        createdBy: user.userId,
        createdByName: user.userName,
      },
    });
    this.gateway.emit({ type: 'item.created', boardId: item.boardId, payload: item });
    return item;
  }

  async listItemsForBoard(boardId: string): Promise<RetroItem[]> {
    await this.assertBoardExists(boardId);
    return this.prisma.retroItem.findMany({
      where: { boardId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async updateItem(id: string, dto: UpdateItemDto, user: UserContext): Promise<RetroItem> {
    const existing = await this.prisma.retroItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Item ${id} not found`);

    if (dto.sectionId && dto.sectionId !== existing.sectionId) {
      const target = await this.prisma.retroSection.findUnique({ where: { id: dto.sectionId } });
      if (!target) throw new NotFoundException(`Section ${dto.sectionId} not found`);
      if (target.boardId !== existing.boardId) {
        throw new BadRequestException('Cannot move item to a section on another board');
      }
    }

    const item = await this.prisma.retroItem.update({
      where: { id },
      data: {
        ...(dto.content !== undefined ? { content: dto.content.trim() } : {}),
        ...(dto.sectionId !== undefined ? { sectionId: dto.sectionId } : {}),
      },
    });

    // Note: we intentionally do not overwrite createdBy / createdByName so
    // attribution is preserved even when other users edit the card.
    void user;

    this.gateway.emit({ type: 'item.updated', boardId: item.boardId, payload: item });
    return item;
  }

  async deleteItem(id: string): Promise<{ id: string; boardId: string }> {
    const existing = await this.prisma.retroItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Item ${id} not found`);
    await this.prisma.retroItem.delete({ where: { id } });
    this.gateway.emit({
      type: 'item.deleted',
      boardId: existing.boardId,
      payload: { id, boardId: existing.boardId },
    });
    return { id, boardId: existing.boardId };
  }

  // ---------------------- Helpers ----------------------

  private async assertBoardExists(boardId: string): Promise<void> {
    const board = await this.prisma.retroBoard.findUnique({
      where: { id: boardId },
      select: { id: true },
    });
    if (!board) throw new NotFoundException(`Board ${boardId} not found`);
  }
}
