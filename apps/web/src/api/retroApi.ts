import axios from 'axios';
import { RetroBoard, RetroSection, RetroItem } from '../types/retro.types';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Boards
export const getBoards = async (): Promise<RetroBoard[]> => {
  const { data } = await api.get('/retro/boards');
  return data;
};

export const createBoard = async (
  title: string,
  createdBy: string,
): Promise<RetroBoard> => {
  const { data } = await api.post('/retro/boards', { title, createdBy });
  return data;
};

export const getBoardById = async (id: string): Promise<RetroBoard> => {
  const { data } = await api.get(`/retro/boards/${id}`);
  return data;
};

// Sections
export const getSections = async (boardId: string): Promise<RetroSection[]> => {
  const { data } = await api.get(`/retro/sections/${boardId}`);
  return data;
};

export const createSection = async (
  boardId: string,
  title: string,
  createdBy: string,
): Promise<RetroSection> => {
  const { data } = await api.post('/retro/sections', { boardId, title, createdBy });
  return data;
};

export const updateSection = async (
  id: string,
  updateData: { title?: string; order?: number },
): Promise<RetroSection> => {
  const { data } = await api.patch(`/retro/sections/${id}`, updateData);
  return data;
};

export const deleteSection = async (id: string): Promise<void> => {
  await api.delete(`/retro/sections/${id}`);
};

export const reorderSections = async (sectionIds: string[]): Promise<void> => {
  await api.patch('/retro/sections/reorder', { sectionIds });
};

// Items
export const getItems = async (boardId: string): Promise<RetroItem[]> => {
  const { data } = await api.get(`/retro/items/${boardId}`);
  return data;
};

export const createItem = async (
  boardId: string,
  sectionId: string,
  content: string,
  createdBy: string,
  createdByName: string,
): Promise<RetroItem> => {
  const { data } = await api.post('/retro/items', {
    boardId,
    sectionId,
    content,
    createdBy,
    createdByName,
  });
  return data;
};

export const updateItem = async (
  id: string,
  updateData: { content?: string; sectionId?: string },
): Promise<RetroItem> => {
  const { data } = await api.patch(`/retro/items/${id}`, updateData);
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/retro/items/${id}`);
};
