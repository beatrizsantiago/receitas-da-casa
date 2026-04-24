import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Text,
} from '@chakra-ui/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { LuPlus, LuSearch } from 'react-icons/lu';
import { useRecipesQuery } from '../hooks/useRecipes';
import { useTagsQuery } from '@/features/tags/hooks/useTags';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import type { RecipeCategory } from '../types';

const CATEGORY_META: Record<string, { label: string; bg: string; fg: string }> = {
  SWEET: { label: 'Doce', bg: 'yellow.100', fg: 'yellow.900' },
  SAVORY: { label: 'Salgado', bg: 'secondary.100', fg: 'secondary.900' },
};

export default function RecipeList() {
  const navigate = useNavigate();
  const mobile = useBreakpointValue({ base: true, md: false });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<RecipeCategory | 'all'>('all');
  const [tagFilter, setTagFilter] = useState<string[]>([]);

  const { data, isLoading } = useRecipesQuery({ limit: 200, category: category === 'all' ? undefined : category });
  const recipes = data?.data ?? [];

  const { data: tagsData } = useTagsQuery();
  const allTags = tagsData ?? [];

  const filtered = recipes.filter((r) => {
    if (tagFilter.length > 0 && !tagFilter.every((t) => r.tags?.some((rt) => rt.tag.name === t))) return false;
    if (search) {
      const s = search.toLowerCase();
      if (!r.title.toLowerCase().includes(s) && !r.description?.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const toggleTag = (t: string) => {
    setTagFilter((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <Box minH="100vh" bg="beige.100" px={mobile ? 4 : 10} py={mobile ? 6 : 8} pb={mobile ? 20 : 16}>
      <Flex justify="space-between" align="flex-end" gap={4} mb={5} flexWrap="wrap">
        <Box>
          <Text fontFamily="'Caveat', cursive" fontSize="xl" color="primary.600" lineHeight={1}>
            seu caderno
          </Text>
          <Heading size={mobile ? 'lg' : 'xl'} color="neutral.800" fontWeight="600" letterSpacing="-0.02em" mt={1}>
            Todas as receitas
          </Heading>
          <Text fontSize="sm" color="neutral.500" mt={1}>
            {filtered.length} {filtered.length === 1 ? 'receita' : 'receitas'}
            {(search || category !== 'all' || tagFilter.length > 0) ? ' encontradas' : ''}
          </Text>
        </Box>
        {!mobile && (
          <Button colorPalette="primary" onClick={() => navigate('/receitas/nova')}>
            <Flex align="center" gap={2}>
              <LuPlus size={16} />
              Nova Receita
            </Flex>
          </Button>
        )}
      </Flex>

      <Flex direction="column" gap={3} mb={5}>
        <Box position="relative" maxW="480px">
          <Box position="absolute" left="12px" top="50%" transform="translateY(-50%)" color="neutral.400" pointerEvents="none">
            <LuSearch size={16} />
          </Box>
          <Input
            placeholder="Buscar por título, ingrediente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            pl="38px"
            bg="white"
            borderColor="neutral.200"
            _hover={{ borderColor: 'neutral.300' }}
            _focus={{ borderColor: 'primary.400' }}
          />
        </Box>

        <Flex gap={2} flexWrap="wrap">
          <Badge
            cursor="pointer"
            px={3}
            py={1}
            rounded="md"
            fontSize="sm"
            fontWeight="500"
            bg={category === 'all' ? 'neutral.800' : 'white'}
            color={category === 'all' ? 'white' : 'neutral.600'}
            borderWidth="1px"
            borderColor={category === 'all' ? 'transparent' : 'neutral.200'}
            onClick={() => setCategory('all')}
          >
            Todas
          </Badge>
          {Object.entries(CATEGORY_META).map(([key, meta]) => (
            <Badge
              key={key}
              cursor="pointer"
              px={3}
              py={1}
              rounded="md"
              fontSize="sm"
              fontWeight="500"
              bg={category === key ? meta.bg : 'white'}
              color={category === key ? meta.fg : 'neutral.600'}
              borderWidth="1px"
              borderColor={category === key ? 'transparent' : 'neutral.200'}
              onClick={() => setCategory(key as RecipeCategory)}
            >
              {meta.label}
            </Badge>
          ))}
        </Flex>

        {allTags.length > 0 && (
          <Flex gap={2} flexWrap="wrap" align="center">
            <Text fontSize="xs" color="neutral.500" fontWeight="600" letterSpacing="0.04em" textTransform="uppercase">
              Tags
            </Text>
            {allTags.slice(0, 12).map((t) => (
              <Badge
                key={t.id}
                cursor="pointer"
                px={2.5}
                py={0.5}
                rounded="md"
                fontSize="xs"
                fontWeight="500"
                bg={tagFilter.includes(t.name) ? 'neutral.800' : 'white'}
                color={tagFilter.includes(t.name) ? 'white' : 'neutral.600'}
                borderWidth="1px"
                borderColor={tagFilter.includes(t.name) ? 'transparent' : 'neutral.200'}
                onClick={() => toggleTag(t.name)}
              >
                #{t.name}
              </Badge>
            ))}
          </Flex>
        )}
      </Flex>

      {isLoading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma receita encontrada"
          description="Tente ajustar os filtros ou busque por outra palavra."
          action={{ label: 'Limpar filtros', onClick: () => { setSearch(''); setCategory('all'); setTagFilter([]); } }}
        />
      ) : (
        <Grid templateColumns={mobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(240px, 1fr))'} gap={4}>
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </Grid>
      )}

      {mobile && (
        <Button
          position="fixed"
          bottom={20}
          right={5}
          zIndex={50}
          w="58px"
          h="58px"
          borderRadius="full"
          colorPalette="primary"
          shadow="xl"
          onClick={() => navigate('/receitas/nova')}
        >
          <LuPlus size={24} />
        </Button>
      )}
    </Box>
  );
}
