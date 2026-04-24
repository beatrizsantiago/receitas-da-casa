import api from '@/shared/services/api';
import type { AddTagDto, Tag } from '../types';

export const tagsService = {
  async list(): Promise<Tag[]> {
    const { data } = await api.get<Tag[]>('/tags');
    return data;
  },

  async create(dto: AddTagDto): Promise<Tag> {
    const { data } = await api.post<Tag>('/tags', dto);
    return data;
  },

  async update(id: number, dto: AddTagDto): Promise<Tag> {
    const { data } = await api.patch<Tag>(`/tags/${id}`, dto);
    return data;
  },

  async remove(id: number): Promise<void> {
    await api.delete(`/tags/${id}`);
  },
};
