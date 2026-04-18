// Re-export the Prisma-generated row types as the canonical entity types
// for the retro module. The service layer returns these directly.
export type { RetroBoard, RetroSection, RetroItem } from '@prisma/client';

export interface BoardWithChildren {
  id: string;
  title: string;
  createdBy: string;
  createdAt: Date;
  sections: Array<{
    id: string;
    title: string;
    type: string | null;
    color: string | null;
    order: number;
    createdBy: string;
    createdAt: Date;
  }>;
  items: Array<{
    id: string;
    boardId: string;
    sectionId: string;
    content: string;
    createdBy: string;
    createdByName: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}
