export interface RetroBoard {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  _count?: { items: number };
  sections?: RetroSection[];
  items?: RetroItem[];
}

export interface RetroSection {
  id: string;
  boardId: string;
  title: string;
  order: number;
  createdBy: string;
  createdAt: string;
  items?: RetroItem[];
}

export interface RetroItem {
  id: string;
  boardId: string;
  sectionId: string;
  content: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  section?: RetroSection;
}
