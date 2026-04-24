import { Box } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useBreakpointValue } from '@chakra-ui/react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRecipesQuery } from '@/features/recipes/hooks/useRecipes';
import { LoadingSpinner } from '@/shared/components/ui/LoadingSpinner';
import { DashboardHero } from '../components/DashboardHero';
import { RecentRecipesSection } from '../components/RecentRecipesSection';
import { MostCookedSection } from '../components/MostCookedSection';
import { CategorySummarySection } from '../components/CategorySummarySection';
import { DashboardEmptyState } from '../components/DashboardEmptyState';
import { useRecipeStats } from '../hooks/useRecipeStats';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading } = useRecipesQuery({ limit: 50 });
  const recipes = data?.data ?? [];
  const mobile = useBreakpointValue({ base: true, md: false });

  const { recent, mostCooked, categoryCounts } = useRecipeStats(recipes, !!mobile);
  const showEmpty = !isLoading && recipes.length === 0;

  return (
    <Box minH="100vh" bg="beige.100" px={mobile ? 4 : 10} py={mobile ? 6 : 8} pb={mobile ? 10 : 16}>
      <DashboardHero
        userName={user?.name}
        recipeCount={recipes.length}
        mobile={!!mobile}
        onNewRecipe={() => navigate('/receitas/nova')}
      />

      {isLoading ? (
        <Box mt={8}>
          <LoadingSpinner />
        </Box>
      ) : showEmpty ? (
        <DashboardEmptyState onCreate={() => navigate('/receitas/nova')} />
      ) : (
        <>
          <RecentRecipesSection recipes={recent} mobile={!!mobile} onViewAll={() => navigate('/receitas')} />

          <Box mt={8} display="grid" gridTemplateColumns={mobile ? '1fr' : '1.4fr 1fr'} gap={6}>
            <MostCookedSection recipes={mostCooked} onRecipeClick={(id) => navigate(`/receitas/${id}`)} />
            <CategorySummarySection categories={categoryCounts} onViewAll={() => navigate('/receitas')} />
          </Box>
        </>
      )}
    </Box>
  );
}
