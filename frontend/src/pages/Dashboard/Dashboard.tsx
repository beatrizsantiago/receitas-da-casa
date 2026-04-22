import { Box, Button, Flex, Grid, Heading, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../../features/recipes/hooks/useRecipes';
import { RecipeCard } from '../../features/recipes/components/RecipeCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { EmptyState } from '../../components/ui/EmptyState';

export default function Dashboard() {
  const navigate = useNavigate();
  const { result, isLoading } = useRecipes({ limit: 6 });

  const recentRecipes = result?.data ?? [];
  const mostCooked = [...recentRecipes]
    .sort((a, b) => (b._count?.cookHistory ?? 0) - (a._count?.cookHistory ?? 0))
    .slice(0, 3);

  return (
    <Box minH="100vh" bg="beige.100">
      <Flex as="nav" bg="white" shadow="sm" px={6} py={4} justify="space-between" align="center">
        <Heading size="lg" color="primary.600">Receitas da Casa</Heading>
        <Flex gap={4}>
          <Button variant="ghost" onClick={() => navigate('/receitas')}>Minhas Receitas</Button>
          <Button colorPalette="primary" onClick={() => navigate('/receitas/nova')}>+ Nova Receita</Button>
        </Flex>
      </Flex>

      <Box maxW="1200px" mx="auto" p={6}>
        <VStack align="start" gap={8} w="full">
          <Box w="full">
            <Flex justify="space-between" align="center" mb={4}>
              <Heading size="md">Receitas Recentes</Heading>
              <Button variant="outline" size="sm" onClick={() => navigate('/receitas')}>Ver todas</Button>
            </Flex>
            {isLoading ? (
              <LoadingSpinner />
            ) : recentRecipes.length === 0 ? (
              <EmptyState
                title="Nenhuma receita ainda"
                description="Comece criando sua primeira receita!"
                action={{ label: 'Criar receita', onClick: () => navigate('/receitas/nova') }}
              />
            ) : (
              <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
                {recentRecipes.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </Grid>
            )}
          </Box>

          {mostCooked.length > 0 && (
            <Box w="full">
              <Heading size="md" mb={4}>Mais Cozinhadas</Heading>
              <Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
                {mostCooked.map((r) => (
                  <RecipeCard key={r.id} recipe={r} />
                ))}
              </Grid>
            </Box>
          )}
        </VStack>
      </Box>
    </Box>
  );
}
