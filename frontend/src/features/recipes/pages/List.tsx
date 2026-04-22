import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  NativeSelect,
  VStack,
} from '@chakra-ui/react';
import { useRecipes } from '../hooks/useRecipes';
import { RecipeCard } from '../components/RecipeCard';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { EmptyState } from '../../../components/ui/EmptyState';
import type { RecipeCategory } from '../types';

export default function RecipeList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<RecipeCategory | ''>('');

  const { result, isLoading } = useRecipes({ limit: 50, category: category || undefined });

  const recipes = result?.data ?? [];
  const filtered = recipes.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box minH="100vh" bg="beige.100">
      <Flex as="nav" bg="white" shadow="sm" px={6} py={4} justify="space-between" align="center">
        <Heading size="lg" color="primary.600">Receitas da Casa</Heading>
        <Flex gap={4}>
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
          <Button colorPalette="primary" onClick={() => navigate('/receitas/nova')}>+ Nova Receita</Button>
        </Flex>
      </Flex>

      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={6} w="full">
          <Flex w="full" gap={4} flexWrap="wrap">
            <Input
              placeholder="Buscar receita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxW="400px"
              bg="white"
            />
            <NativeSelect.Root maxW="200px">
              <NativeSelect.Field
                placeholder="Todas as categorias"
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory | '')}
                bg="white"
              >
                <option value="SWEET">Doce</option>
                <option value="SAVORY">Salgado</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Flex>

          {isLoading ? (
            <LoadingSpinner />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="Nenhuma receita encontrada"
              description="Tente ajustar os filtros ou crie uma nova receita."
              action={{ label: 'Criar receita', onClick: () => navigate('/receitas/nova') }}
            />
          ) : (
            <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4} w="full">
              {filtered.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </Grid>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
