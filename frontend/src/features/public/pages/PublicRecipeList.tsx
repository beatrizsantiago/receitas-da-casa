import { Box, Button, Flex, Grid, Heading, Input, Text } from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuSearch, LuSlidersHorizontal } from 'react-icons/lu';
import { usePublicRecipesQuery } from '../hooks/usePublicRecipes';
import { useRecipeFilters } from '../hooks/useRecipeFilters';
import { PublicRecipeCard } from '../components/PublicRecipeCard';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';
import { ActiveFilters } from '@/shared/components/ui/ActiveFilters';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { CATEGORY_META } from '@/shared';
import type { PublicCategory } from '../types';

const CATEGORY_OPTIONS = [
  { key: 'all', label: 'Todas' },
  ...Object.entries(CATEGORY_META).map(([key, m]) => ({ key, label: m.label })),
];

export default function PublicRecipeList() {
  const mobile = useBreakpointValue({ base: true, md: false });

  const { data, isLoading } = usePublicRecipesQuery({ limit: 200 });
  const recipes = data?.data ?? [];

  const {
    inputValue,
    setInputValue,
    category,
    setCategory,
    tagFilter,
    setTagFilter,
    draftCategory,
    setDraftCategory,
    draftTags,
    setDraftTags,
    filterOpen,
    setFilterOpen,
    filterRef,
    allTags,
    filtered,
    activeFilterCount,
    openFilter,
    applyFilter,
    toggleDraftTag,
    clearFilters,
  } = useRecipeFilters(recipes);

  const activeCategory =
    category !== 'all' ? CATEGORY_META[category] : undefined;

  return (
    <Box minH="100vh" bg="beige.100" px={mobile ? 4 : 10} py={mobile ? 6 : 8} pb={16}>
      <Box mb={5}>
        <Text fontFamily="'Caveat', cursive" fontSize="20px" color="primary.500" lineHeight={1}>
          receitas da casa
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
          {inputValue || category !== 'all' || tagFilter.length > 0 ? ' encontradas' : ''}
        </Text>
      </Box>

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
              <FilterDropdown
                categoryOptions={CATEGORY_OPTIONS}
                tags={allTags}
                draftCategory={draftCategory}
                draftTags={draftTags}
                onCategoryChange={(key) => setDraftCategory(key as PublicCategory | 'all')}
                onTagToggle={toggleDraftTag}
                onApply={applyFilter}
                onClear={() => { setDraftCategory('all'); setDraftTags([]); }}
              />
            )}
          </Box>
        </Flex>

        {activeFilterCount > 0 && (
          <ActiveFilters
            activeCategory={activeCategory}
            tagFilter={tagFilter}
            allTags={allTags}
            onRemoveCategory={() => setCategory('all')}
            onRemoveTag={(name) => setTagFilter(tagFilter.filter((x) => x !== name))}
          />
        )}
      </Box>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma receita encontrada"
          description="Tente ajustar os filtros ou busque por outra palavra."
          action={{ label: 'Limpar filtros', onClick: clearFilters }}
        />
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={4}
        >
          {filtered.map((r) => (
            <PublicRecipeCard key={r.id} recipe={r} />
          ))}
        </Grid>
      )}
    </Box>
  );
}
