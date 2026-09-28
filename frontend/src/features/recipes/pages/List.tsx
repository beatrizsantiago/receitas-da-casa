import { useState, useEffect, useRef, useMemo } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuPlus, LuSearch, LuSlidersHorizontal, LuX } from 'react-icons/lu';
import { useRecipesQuery } from '../hooks/useRecipes';
import { useTagsQuery } from '@/features/tags/hooks/useTags';
import { RecipeCard } from '../components/RecipeCard';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { ActiveFilters } from '@/shared/components/ui/ActiveFilters';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { CATEGORY_META } from '@/shared';
import { searchScore, tokenize } from '@/shared/utils/search';
import type { RecipeCategory } from '../types';

const CATEGORY_OPTIONS = [
  { key: 'all', label: 'Todas' },
  ...Object.entries(CATEGORY_META).map(([key, m]) => ({ key, label: m.label })),
];

export default function RecipeList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mobile = useBreakpointValue({ base: true, md: false });

  const [inputValue, setInputValue] = useState(() => searchParams.get('busca') ?? '');
  const [search, setSearch] = useState(inputValue);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 250);
    return () => clearTimeout(timer);
  }, [inputValue]);

  // Mantém o termo na URL para sobreviver ao "voltar" da página de detalhe
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (search.trim()) next.set('busca', search.trim());
        else next.delete('busca');
        return next;
      },
      { replace: true },
    );
  }, [search, setSearchParams]);

  function clearSearch() {
    setInputValue('');
    setSearch('');
  }

  const [category, setCategory] = useState<RecipeCategory | 'all'>(() => {
    const catParam = searchParams.get('categoria');
    return catParam === 'SWEET' || catParam === 'SAVORY' ? catParam : 'all';
  });
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<RecipeCategory | 'all'>(category);
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [filterOpen]);

  function openFilter() {
    setDraftCategory(category);
    setDraftTags([...tagFilter]);
    setFilterOpen(true);
  }

  function applyFilter() {
    setCategory(draftCategory);
    setTagFilter(draftTags);
    setFilterOpen(false);
  }

  function toggleDraftTag(name: string) {
    setDraftTags((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  const { data, isLoading, error } = useRecipesQuery({
    limit: 200,
    category: category === 'all' ? undefined : category,
  });
  const recipes = useMemo(() => data?.data ?? [], [data]);

  useEffect(() => {
    if (error) toast.error('Erro ao carregar receitas');
  }, [error]);

  const { data: tagsData } = useTagsQuery();
  const allTags = tagsData ?? [];

  const filtered = useMemo(() => {
    const byTags = recipes.filter(
      (r) =>
        tagFilter.length === 0 ||
        tagFilter.every((t) => r.tags?.some((rt) => rt.tag.name === t)),
    );

    const terms = tokenize(search);
    if (terms.length === 0) return byTags;

    return byTags
      .map((r) => ({
        recipe: r,
        score: searchScore(terms, [
          { values: [r.title], weight: 10 },
          { values: r.tags?.map((rt) => rt.tag.name) ?? [], weight: 5 },
          { values: r.ingredientNames ?? [], weight: 3 },
          { values: [r.description], weight: 2 },
        ]),
      }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.recipe);
  }, [recipes, tagFilter, search]);

  const activeFilterCount = (category !== 'all' ? 1 : 0) + tagFilter.length;

  function removeCategory() {
    setCategory('all');
  }

  function removeTagFilter(name: string) {
    setTagFilter((prev) => prev.filter((x) => x !== name));
  }

  return (
    <Box minH="100vh" bg="beige.100" px={mobile ? 4 : 10} py={mobile ? 6 : 8} pb={16}>
      <Flex justify="space-between" align="flex-start" gap={4} mb={5}>
        <Box>
          <Text
            fontFamily="'Caveat', cursive"
            fontSize="20px"
            color="primary.500"
            lineHeight={1}
          >
            seu caderno
          </Text>
          <Heading
            fontFamily="'Fraunces', Georgia, serif"
            fontSize={mobile ? '26px' : '32px'}
            fontWeight="500"
            color="neutral.800"
            letterSpacing="-0.02em"
            lineHeight={1.1}
            mt={1}
          >
            Todas as receitas
          </Heading>
          <Text fontSize="13px" color="neutral.400" mt={1}>
            {filtered.length} {filtered.length === 1 ? 'receita' : 'receitas'}
            {search || category !== 'all' || tagFilter.length > 0
              ? ' encontradas'
              : ''}
          </Text>
        </Box>
        <Button
          bg="primary.500"
          color="white"
          size="sm"
          fontSize="13px"
          fontWeight="550"
          rounded="10px"
          px={mobile ? 3 : 4}
          flexShrink={0}
          display="inline-flex"
          alignItems="center"
          gap={1.5}
          boxShadow="0 4px 12px rgba(196,74,47,0.25)"
          mt={1}
          onClick={() => navigate('/receitas/nova')}
        >
          <LuPlus size={15} />
          {mobile ? 'Nova' : 'Nova Receita'}
        </Button>
      </Flex>

      <Box mb={activeFilterCount > 0 ? 3 : 5}>
        <Flex gap={2}>
          <Box position="relative" flex={1}>
            <Box
              position="absolute"
              left="12px"
              top="50%"
              transform="translateY(-50%)"
              color="neutral.400"
              pointerEvents="none"
              zIndex={1}
            >
              <LuSearch size={15} />
            </Box>
            <Input
              type="search"
              placeholder={mobile ? 'Nome, ingrediente ou tag...' : 'Buscar por nome, ingrediente ou tag...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && clearSearch()}
              pl="38px"
              pr={inputValue ? '38px' : undefined}
              bg="white"
              fontSize="14px"
              _placeholder={{ color: 'neutral.400' }}
              css={{ '&::-webkit-search-cancel-button': { display: 'none' } }}
            />
            {inputValue && (
              <Box
                as="button"
                aria-label="Limpar busca"
                position="absolute"
                right="10px"
                top="50%"
                transform="translateY(-50%)"
                zIndex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="22px"
                h="22px"
                rounded="full"
                color="neutral.400"
                _hover={{ bg: 'beige.100', color: 'neutral.600' }}
                onClick={clearSearch}
              >
                <LuX size={14} />
              </Box>
            )}
          </Box>

          <Box ref={filterRef} position="relative" flexShrink={0}>
            <Button
              px={3}
              bg={filterOpen || activeFilterCount > 0 ? 'primary.50' : 'white'}
              color={filterOpen || activeFilterCount > 0 ? 'primary.700' : 'neutral.600'}
              borderWidth="1px"
              borderColor={filterOpen || activeFilterCount > 0 ? 'primary.200' : 'beige.200'}
              fontSize="13px"
              fontWeight="500"
              display="inline-flex"
              alignItems="center"
              gap={2}
              transition="all 0.15s"
              onClick={filterOpen ? () => setFilterOpen(false) : openFilter}
            >
              <LuSlidersHorizontal size={15} />
              Filtros
              {activeFilterCount > 0 && (
                <Box
                  display="inline-flex"
                  alignItems="center"
                  justifyContent="center"
                  w="18px"
                  h="18px"
                  rounded="full"
                  bg="primary.500"
                  color="white"
                  fontSize="10px"
                  fontWeight="700"
                >
                  {activeFilterCount}
                </Box>
              )}
            </Button>

            {filterOpen && (
              <FilterDropdown
                categoryOptions={CATEGORY_OPTIONS}
                tags={allTags}
                draftCategory={draftCategory}
                draftTags={draftTags}
                onCategoryChange={(key) => setDraftCategory(key as RecipeCategory | 'all')}
                onTagToggle={toggleDraftTag}
                onApply={applyFilter}
                onClear={() => { setDraftCategory('all'); setDraftTags([]); }}
              />
            )}
          </Box>
        </Flex>

        {activeFilterCount > 0 && (
          <ActiveFilters
            activeCategory={category !== 'all' ? CATEGORY_META[category] : undefined}
            tagFilter={tagFilter}
            allTags={allTags}
            onRemoveCategory={removeCategory}
            onRemoveTag={removeTagFilter}
          />
        )}
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma receita encontrada"
          description={
            search.trim()
              ? `Nada encontrado para “${search.trim()}”. Tente outra palavra ou ajuste os filtros.`
              : 'Tente ajustar os filtros ou busque por outra palavra.'
          }
          action={{
            label: 'Limpar filtros',
            onClick: () => {
              clearSearch();
              setCategory('all');
              setTagFilter([]);
            },
          }}
        />
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={4}
        >
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </Grid>
      )}
    </Box>
  );
}
