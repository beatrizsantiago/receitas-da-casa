import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { LuCheck, LuPlus, LuSearch, LuSlidersHorizontal, LuX } from 'react-icons/lu';
import { useRecipesQuery } from '../hooks/useRecipes';
import { useTagsQuery } from '@/features/tags/hooks/useTags';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import type { RecipeCategory } from '../types';

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  SWEET: { label: 'Doce', color: 'primary' },
  SAVORY: { label: 'Salgado', color: 'secondary' },
};

export default function RecipeList() {
  const navigate = useNavigate();
  const mobile = useBreakpointValue({ base: true, md: false });

  const [inputValue, setInputValue] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(inputValue), 600);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const [category, setCategory] = useState<RecipeCategory | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState<RecipeCategory | 'all'>('all');
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

  const { data, isLoading } = useRecipesQuery({
    limit: 200,
    category: category === 'all' ? undefined : category,
  });
  const recipes = data?.data ?? [];

  const { data: tagsData } = useTagsQuery();
  const allTags = tagsData ?? [];

  const filtered = recipes.filter((r) => {
    if (
      tagFilter.length > 0 &&
      !tagFilter.every((t) => r.tags?.some((rt) => rt.tag.name === t))
    )
      return false;
    if (search) {
      const s = search.toLowerCase();
      if (
        !r.title.toLowerCase().includes(s) &&
        !r.description?.toLowerCase().includes(s)
      )
        return false;
    }
    return true;
  });

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
            >
              <LuSearch size={15} />
            </Box>
            <Input
              placeholder="Buscar receitas..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              pl="38px"
              bg="white"
              fontSize="14px"
              _placeholder={{ color: 'neutral.400' }}
            />
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
              <Box
                position="absolute"
                top="calc(100% + 8px)"
                right={0}
                zIndex={300}
                bg="white"
                rounded="16px"
                boxShadow="0 8px 32px rgba(47,30,10,0.14)"
                borderWidth="1px"
                borderColor="beige.200"
                p={4}
                minW="260px"
                maxW="320px"
              >
                <Text
                  fontSize="11px"
                  fontWeight="700"
                  color="neutral.500"
                  letterSpacing="0.07em"
                  textTransform="uppercase"
                  mb={2}
                >
                  Categoria
                </Text>
                <Flex direction="column" gap={1} mb={4}>
                  {[
                    { key: 'all', label: 'Todas' },
                    ...Object.entries(CATEGORY_META).map(([key, m]) => ({ key, label: m.label })),
                  ].map(({ key, label }) => (
                    <Box
                      as="button"
                      key={key}
                      display="flex"
                      alignItems="center"
                      gap={2.5}
                      px={2.5}
                      py={1.5}
                      rounded="10px"
                      fontSize="13px"
                      fontWeight="500"
                      color={draftCategory === key ? 'primary.700' : 'neutral.700'}
                      bg={draftCategory === key ? 'primary.50' : 'transparent'}
                      transition="all 0.12s"
                      onClick={() => setDraftCategory(key as RecipeCategory | 'all')}
                    >
                      <Box
                        w="16px"
                        h="16px"
                        rounded="full"
                        borderWidth="1.5px"
                        borderColor={draftCategory === key ? 'primary.500' : 'neutral.300'}
                        bg={draftCategory === key ? 'primary.500' : 'transparent'}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        {draftCategory === key && (
                          <Box w="6px" h="6px" rounded="full" bg="white" />
                        )}
                      </Box>
                      {label}
                    </Box>
                  ))}
                </Flex>

                {allTags.length > 0 && (
                  <>
                    <Text
                      fontSize="11px"
                      fontWeight="700"
                      color="neutral.500"
                      letterSpacing="0.07em"
                      textTransform="uppercase"
                      mb={2}
                    >
                      Tags
                    </Text>
                    <Flex direction="column" gap={1} mb={4}>
                      {allTags.map((t) => {
                        const checked = draftTags.includes(t.name);
                        return (
                          <Box
                            as="button"
                            key={t.id}
                            display="flex"
                            alignItems="center"
                            gap={2.5}
                            px={2.5}
                            py={1.5}
                            rounded="10px"
                            fontSize="13px"
                            fontWeight="500"
                            color="neutral.700"
                            bg={checked ? t.color + '12' : 'transparent'}
                            transition="all 0.12s"
                            onClick={() => toggleDraftTag(t.name)}
                          >
                            <Box
                              w="16px"
                              h="16px"
                              rounded="4px"
                              borderWidth="1.5px"
                              borderColor={checked ? t.color : 'neutral.300'}
                              bg={checked ? t.color : 'transparent'}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              flexShrink={0}
                            >
                              {checked && <LuCheck size={10} color="white" />}
                            </Box>
                            <Box
                              as="span"
                              style={{ color: t.color }}
                              fontWeight="600"
                            >
                              #{t.name}
                            </Box>
                          </Box>
                        );
                      })}
                    </Flex>
                  </>
                )}

                <Flex gap={2} borderTopWidth="1px" borderColor="beige.100" pt={3}>
                  <Button
                    variant="ghost"
                    size="sm"
                    flex={1}
                    fontSize="13px"
                    fontWeight="500"
                    color="neutral.500"
                    onClick={() => {
                      setDraftCategory('all');
                      setDraftTags([]);
                    }}
                  >
                    Limpar
                  </Button>
                  <Button
                    bg="primary.500"
                    color="white"
                    size="sm"
                    flex={1}
                    fontSize="13px"
                    fontWeight="550"
                    rounded="10px"
                    onClick={applyFilter}
                  >
                    Filtrar
                  </Button>
                </Flex>
              </Box>
            )}
          </Box>
        </Flex>

        {activeFilterCount > 0 && (
          <Flex gap={2} flexWrap="wrap" mt={3}>
            {category !== 'all' && (
              <Flex
                as="button"
                align="center"
                gap={1.5}
                px={2.5}
                py={1}
                rounded="full"
                fontSize="12px"
                fontWeight="600"
                bg={CATEGORY_META[category]?.color === 'primary' ? 'primary.50' : 'secondary.50'}
                color={CATEGORY_META[category]?.color === 'primary' ? 'primary.700' : 'secondary.700'}
                borderWidth="1px"
                borderColor={CATEGORY_META[category]?.color === 'primary' ? 'primary.200' : 'secondary.200'}
                onClick={removeCategory}
              >
                {CATEGORY_META[category]?.label}
                <LuX size={11} />
              </Flex>
            )}
            {tagFilter.map((name) => {
              const tag = allTags.find((t) => t.name === name);
              return (
                <Flex
                  as="button"
                  key={name}
                  align="center"
                  gap={1.5}
                  px={2.5}
                  py={1}
                  rounded="full"
                  fontSize="12px"
                  fontWeight="600"
                  style={
                    tag
                      ? { backgroundColor: tag.color + '20', color: tag.color, border: `1px solid ${tag.color}44` }
                      : { backgroundColor: '#f5f5f5', color: '#555' }
                  }
                  onClick={() => removeTagFilter(name)}
                >
                  #{name}
                  <LuX size={11} />
                </Flex>
              );
            })}
          </Flex>
        )}
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma receita encontrada"
          description="Tente ajustar os filtros ou busque por outra palavra."
          action={{
            label: 'Limpar filtros',
            onClick: () => {
              setInputValue('');
              setSearch('');
              setCategory('all');
              setTagFilter([]);
            },
          }}
        />
      ) : (
        <Grid
          templateColumns={mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'}
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
