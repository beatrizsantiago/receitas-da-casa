import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagsService } from '../services/tags.service';

const TAGS_KEY = 'tags';

export function useTagsQuery() {
  return useQuery({
    queryKey: [TAGS_KEY],
    queryFn: () => tagsService.list(),
  });
}

export function useCreateTagMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsService.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TAGS_KEY] }),
  });
}

export function useDeleteTagMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsService.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: [TAGS_KEY] }),
  });
}
