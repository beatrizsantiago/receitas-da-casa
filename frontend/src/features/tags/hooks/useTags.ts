import { useQuery, useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { tagsService } from '../services/tags.service';

const TAGS_KEY = 'tags';

// Nome e cor da tag aparecem nas receitas (lista, dashboard e detalhe)
function invalidateTagsAndRecipes(qc: QueryClient) {
  qc.invalidateQueries({ queryKey: [TAGS_KEY] });
  qc.invalidateQueries({ queryKey: ['recipes'] });
  qc.invalidateQueries({ queryKey: ['recipe'] });
}

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

export function useUpdateTagMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: { name: string; color: string } }) =>
      tagsService.update(id, dto),
    onSuccess: () => invalidateTagsAndRecipes(qc),
  });
}

export function useDeleteTagMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tagsService.remove,
    onSuccess: () => invalidateTagsAndRecipes(qc),
  });
}
